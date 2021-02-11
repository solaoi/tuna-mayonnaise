package cmd

import (
	"os"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/aymerick/raymond"
	"github.com/eknkc/pug"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mohae/deepcopy"
	"github.com/spf13/cobra"
)

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Serve TUNA-Mayonnaise APIs",
	Long: `Serve TUNA-Mayonnaise APIs

This command serves endpoints you generated on TUNA-Mayonnaise Tool.

Let's access http://localhost:8080 with your paths :)`,
	Run: api,
}

var endpoints map[string]map[string]string

type body struct {
	StatusCode int
	Content string
}

type response struct {
	ContentType string
	ContentBuilder func() body
}

var dynamicEndpoints map[string]response

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, endpoints[c.Path()]["contentType"], []byte(endpoints[c.Path()]["content"]))
}

func dynamicEndpointHandler(c echo.Context) error {
	body := dynamicEndpoints[c.Path()].ContentBuilder()
	return c.Blob(body.StatusCode, dynamicEndpoints[c.Path()].ContentType, []byte(body.Content))
}

func findNext(node map[string]interface{}) (name string, content interface{}, nexts []string) {
	name = node["name"].(string)
	data := node["data"].(map[string]interface{})
	content = data["output"]

	inputs := node["inputs"].(map[string]interface{})
	for _, v := range inputs {
		input := v.(map[string]interface{})
		connections := input["connections"].([]interface{})
		connection := connections[0].(map[string]interface{})
		nexts = append(nexts, fmt.Sprint(connection["node"]))
	}

	return
}

func setContents(nodes map[string]interface{}, id string, depth int, parent string, contents map[int]map[string]map[string]interface{}, isDynamic *bool) {
	node := nodes[id].(map[string]interface{})
	name, content, nexts := findNext(node)
	if !*isDynamic && name == "API" {
		*isDynamic = true
	}
	if _, exist := contents[depth]; !exist {
		contents[depth] = make(map[string]map[string]interface{})
	}
	if _, exist := contents[depth][id]; !exist {
		contents[depth][id] = make(map[string]interface{})
	}
	contents[depth][id]["name"] = name
	contents[depth][id]["parent"] = parent
	contents[depth][id]["content"] = content

	for _, v := range nexts {
		setContents(nodes, v, depth+1, id, contents, isDynamic)
	}
}

func contentBuilder(contents map[int]map[string]map[string]interface{}) func() (content body) {
	return func() (content body) {
		copy := deepcopy.Copy(contents).(map[int]map[string]map[string]interface{})
		for i := len(copy) - 1; i >= 0; i-- {
			for k, v := range copy[i] {
				if v["name"] == "API" {
					url := ""
					for _, v1 := range copy[i+1] {
						if v1["parent"] == k && v1["name"] == "URL" {
							url = v1["content"].(string)
							break
						}
					}
					resp, err := http.Get(url)
					if err != nil || resp.StatusCode >= 400 {
						copy[i][k]["content"] = "##ERROR##"
						continue
					}
					defer resp.Body.Close()
					byteArray, _ := ioutil.ReadAll(resp.Body)
					res := string(byteArray)
					copy[i][k]["content"] = res
				} else if v["name"] == "Template" {
					engine := ""
					tmpl := ""
					ctx := map[string]interface{}{}
					for _, v2 := range copy[i+1] {
						if v2["parent"] == k && v2["name"] == "Handlebars" {
							engine = "Handlebars"
							tmpl = v2["content"].(string)
						} else if v2["parent"] == k && v2["name"] == "Pug" {
							engine = "Pug"
							tmpl = v2["content"].(string)
						} else if v2["parent"] == k && (v2["name"] == "JSON" || v2["name"] == "API") {
							json.Unmarshal([]byte(v2["content"].(string)), &ctx)
						}
					}
					if engine == "Handlebars" {
						result, err := raymond.Render(tmpl, ctx)
						if err != nil {
							log.Fatal("template handling error...")
						}
						copy[i][k]["content"] = result
					} else if engine == "Pug" {
						var tpl bytes.Buffer
						goTpl, _ := pug.CompileString(tmpl)
						goTpl.Execute(&tpl, ctx)
						copy[i][k]["content"] = tpl.String()
					}
				} else if v["name"] == "Endpoint" {
					for _, v3 := range copy[i+1] {
						if v3["parent"] == k && (v3["name"] == "JSON" || v3["name"] == "API" || v3["name"] == "Template") {
							content := v3["content"].(string)
							if(strings.Contains(content, "##ERROR##")){
								return body{http.StatusInternalServerError, ""}
							}
							return body{http.StatusOK, content}
						}
					}
				}
			}
		}
		return body{http.StatusNotFound, ""}
	}
}

func api(cmd *cobra.Command, args []string) {
	endpoints = map[string]map[string]string{}
	dynamicEndpoints = map[string]response{}
	bytes, err := ioutil.ReadFile("tuna-mayonnaise.json")
	if err != nil {
		log.Fatal(err)
	}
	var objmap map[string]interface{}
	if err := json.Unmarshal(bytes, &objmap); err != nil {
		log.Fatal(err)
	}
	nodes := objmap["nodes"].(map[string]interface{})
	for _, v := range nodes {
		node := v.(map[string]interface{})
		if node["name"] == "Endpoint" {
			var contents = map[int]map[string]map[string]interface{}{}
			isDynamic := false
			data := node["data"].(map[string]interface{})
			path := data["path"].(string)
			contentType := data["contentType"].(string)

			id := fmt.Sprint(node["id"])
			setContents(nodes, id, 0, "0", contents, &isDynamic)

			if data["enabledFlag"].(bool) {
				if !isDynamic {
					content := data["content"].(string)
					endpoints[path] = map[string]string{"content": content, "contentType": contentType}
				} else {
					dynamicEndpoints[path] = response{contentType, contentBuilder(contents)}
				}
			}
		}
	}

	// Echo instance
	e := echo.New()
	e.HideBanner = true
	e.HidePort = true

	// Middleware
	logger := middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: logFormat(),
		Output: os.Stdout,
	})
	e.Use(logger)
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Route => handler
	for path := range endpoints {
		e.GET(path, endpointHandler)
	}
	for path := range dynamicEndpoints {
		e.GET(path, dynamicEndpointHandler)
	}

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

func logFormat() string {
	// Refer to https://github.com/tkuchiki/alp
	var format string
	format += "time:${time_rfc3339}\t"
	format += "host:${remote_ip}\t"
	format += "forwardedfor:${header:x-forwarded-for}\t"
	format += "req:-\t"
	format += "status:${status}\t"
	format += "method:${method}\t"
	format += "uri:${uri}\t"
	format += "size:${bytes_out}\t"
	format += "referer:${referer}\t"
	format += "ua:${user_agent}\t"
	format += "reqtime_ns:${latency}\t"
	format += "cache:-\t"
	format += "runtime:-\t"
	format += "apptime:-\t"
	format += "vhost:${host}\t"
	format += "reqtime_human:${latency_human}\t"
	format += "x-request-id:${id}\t"
	format += "host:${host}\n"
	return format
}

func init() {
	rootCmd.AddCommand(apiCmd)
}
