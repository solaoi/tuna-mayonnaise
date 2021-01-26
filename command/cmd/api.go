package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/aymerick/raymond"
	"github.com/eknkc/pug"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mohae/deepcopy"
	"github.com/spf13/cobra"
)

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Serve TUNA-Mayonnaise Api",
	Long: `Serve TUNA-Mayonnaise Api

This command serves TUNA-Mayonnaise Tool Api.
this api serves anything you created on TUNA-Mayonnaise Tool.

serves on localhost:8080`,
	Run: api,
}

var endpoints map[string]map[string]string

type stringAndFn struct {
	String string
	Fn     func() string
}

var dynamicEndpoints map[string]stringAndFn

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, endpoints[c.Path()]["contentType"], []byte(endpoints[c.Path()]["content"]))
}

func dynamicEndpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, dynamicEndpoints[c.Path()].String, []byte(dynamicEndpoints[c.Path()].Fn()))
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

func contentBuilder(contents map[int]map[string]map[string]interface{}) func() (content string) {
	return func() (content string) {
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
					if err != nil {
						log.Fatal("API error...")
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
							return v3["content"].(string)
						}
					}
				}
			}
		}
		return "{}"
	}
}

func api(cmd *cobra.Command, args []string) {
	endpoints = map[string]map[string]string{}
	dynamicEndpoints = map[string]stringAndFn{}
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

			log.Println(data["enabledFlag"])
			if data["enabledFlag"].(bool) {
				if !isDynamic {
					content := data["content"].(string)
					endpoints[path] = map[string]string{"content": content, "contentType": contentType}
				} else {
					dynamicEndpoints[path] = stringAndFn{contentType, contentBuilder(contents)}
				}
			}
		}
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	for path := range endpoints {
		e.GET(path, endpointHandler)
	}
	for path := range dynamicEndpoints {
		e.GET(path, dynamicEndpointHandler)
	}
	e.Logger.Fatal(e.Start(":8080"))
}

func init() {
	rootCmd.AddCommand(apiCmd)
}
