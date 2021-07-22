package cmd

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/aymerick/raymond"
	"github.com/eknkc/pug"
	_ "github.com/go-sql-driver/mysql"
	prom "github.com/labstack/echo-contrib/prometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"github.com/mohae/deepcopy"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/spf13/cobra"
)

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Serve APIs generated on this tool command",
	Long: `Serve APIs generated on this tool command

This command serves endpoints you generated on this tool commnad.

Let's access http://localhost:8080 with your paths :)`,
	Run: api,
}

var client *http.Client

type apiResponse struct {
	Method     string
	URL        string
	StatusCode string
}

type body struct {
	StatusCode   int
	Content      string
	APIResponses []apiResponse
}

type response struct {
	ContentType    string
	ContentBuilder func() body
}

var endpoints map[string]map[string]string
var dbs map[string]*sql.DB

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, endpoints[c.Path()]["contentType"], []byte(endpoints[c.Path()]["content"]))
}

var dynamicEndpoints map[string]response
var dynamicEndpointCounter *prometheus.CounterVec
var isPromEnabled string
var promRet bool

func dynamicEndpointHandler(c echo.Context) error {
	body := dynamicEndpoints[c.Path()].ContentBuilder()
	if isPromEnabled != "OFF" {
		for _, v := range body.APIResponses {
			dynamicEndpointCounter.WithLabelValues(v.StatusCode, v.Method, v.URL).Inc()
		}
	}
	return c.Blob(body.StatusCode, dynamicEndpoints[c.Path()].ContentType, []byte(body.Content))
}

func findNext(node map[string]interface{}) (name string, content interface{}, nexts []string) {
	name = node["name"].(string)
	data := node["data"].(map[string]interface{})

	if name == "API" {
		content = data["url"]
	} else if name == "MySQL" || name == "PostgreSQL" {
		content = map[string]interface{}{"host": data["host"], "port": data["port"], "user": data["user"], "db": data["db"]}
	} else {
		content = data["output"]
	}
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
	if !*isDynamic && (name == "API" || name == "MySQL" || name == "PostgreSQL") {
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
	var apiResponses []apiResponse
	return func() (content body) {
		c := deepcopy.Copy(contents).(map[int]map[string]map[string]interface{})
		for i := len(c) - 1; i >= 0; i-- {
			for k, v := range c[i] {
				if v["name"] == "API" {
					url := v["content"].(string)

					method := "GET"
					req, _ := http.NewRequest(method, url, nil)
					resp, err := client.Do(req)
					if err == nil && resp.StatusCode >= 400 {
						apiResponses = append(apiResponses, apiResponse{method, url, strconv.Itoa(resp.StatusCode)})
						return body{http.StatusInternalServerError, "", apiResponses}
					}
					if err != nil {
						if os.IsTimeout(err) {
							apiResponses = append(apiResponses, apiResponse{method, url, "timeout"})
						} else {
							apiResponses = append(apiResponses, apiResponse{method, url, "unknown"})
						}
						return body{http.StatusInternalServerError, "", apiResponses}
					}
					defer func() {
						io.Copy(io.Discard, resp.Body)
						resp.Body.Close()
					}()
					apiResponses = append(apiResponses, apiResponse{method, url, strconv.Itoa(resp.StatusCode)})
					byteArray, _ := io.ReadAll(resp.Body)
					res := string(byteArray)
					c[i][k]["content"] = res
				} else if v["name"] == "MySQL" || v["name"] == "PostgreSQL" {
					content := v["content"].(map[string]interface{})
					user := fmt.Sprintf("%v", content["user"])
					host := fmt.Sprintf("%v", content["host"])
					port := fmt.Sprintf("%v", content["port"])
					dbName := fmt.Sprintf("%v", content["db"])
					uniqueKey := fmt.Sprintf("%s_%s_%s_%s", user, host, port, dbName)

					query := ""
					dummyJson := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							if v1["name"] == "SQL" {
								query = v1["content"].(string)
							} else if v1["name"] == "JSON" {
								dummyJson = v1["content"].(string)
							}
						}
					}
					if query == "" || dummyJson == "" {
						log.Fatal("set sql params on tool...")
					}

					db := dbs[uniqueKey]
					rows, err := db.Query(query)
					if err != nil {
						// TODO: set Application Metrics
						// fmt.Println(err.Error())
						return body{http.StatusInternalServerError, "", []apiResponse{}}
					}
					defer rows.Close()
					dummy := []map[string]json.RawMessage{}
					errJson := json.Unmarshal([]byte(dummyJson), &dummy)
					if errJson != nil {
						log.Fatal(errJson)
					}
					keys := []string{}
					for k := range dummy[0] {
						keys = append(keys, k)
					}
					sort.Strings(keys)
					count := len(keys)
					results := []map[string]string{}
					for rows.Next() {
						result := map[string]string{}
						containers := make([]string, count)
						copy(containers, keys)
						pointers := make([]interface{}, count)
						for i := 0; i < count; i++ {
							pointers[i] = &containers[i]
						}
						err := rows.Scan(pointers...)
						if err != nil {
							log.Fatal(err.Error())
						}
						for i := 0; i < count; i++ {
							result[keys[i]] = containers[i]
						}
						results = append(results, result)
					}
					err = rows.Err()
					if err != nil {
						log.Fatal(err.Error())
					}
					json, err := json.Marshal(results)
					if err != nil {
						log.Fatal(err)
					}
					c[i][k]["content"] = string(json)
				} else if v["name"] == "Template" {
					engine := ""
					tmpl := ""
					ctx := map[string]interface{}{}
					ctxs := []map[string]interface{}{}
					for _, v2 := range c[i+1] {
						if v2["parent"] == k && v2["name"] == "Handlebars" {
							engine = "Handlebars"
							tmpl = v2["content"].(string)
						} else if v2["parent"] == k && v2["name"] == "Pug" {
							engine = "Pug"
							tmpl = v2["content"].(string)
						} else if v2["parent"] == k && (v2["name"] == "JSON" || v2["name"] == "API" || v2["name"] == "MySQL" || v2["name"] == "PostgreSQL") {
							if strings.HasPrefix(v2["content"].(string), "[") {
								json.Unmarshal([]byte(v2["content"].(string)), &ctxs)
							} else {
								json.Unmarshal([]byte(v2["content"].(string)), &ctx)
							}
						}
					}
					if len(ctxs) == 0 {
						if engine == "Handlebars" {
							result, err := raymond.Render(tmpl, ctx)
							if err != nil {
								log.Fatal("template handling error...")
							}
							c[i][k]["content"] = result
						} else if engine == "Pug" {
							var tpl bytes.Buffer
							goTpl, _ := pug.CompileString(tmpl)
							goTpl.Execute(&tpl, ctx)
							c[i][k]["content"] = tpl.String()
						}
					} else {
						if engine == "Handlebars" {
							result, err := raymond.Render(tmpl, ctxs)
							if err != nil {
								log.Fatal("template handling error...")
							}
							c[i][k]["content"] = result
						} else if engine == "Pug" {
							var tpl bytes.Buffer
							goTpl, _ := pug.CompileString(tmpl)
							goTpl.Execute(&tpl, ctxs)
							c[i][k]["content"] = tpl.String()
						}
					}
				} else if v["name"] == "Endpoint" {
					for _, v3 := range c[i+1] {
						if v3["parent"] == k && (v3["name"] == "JSON" || v3["name"] == "API" || v3["name"] == "MySQL" || v3["name"] == "PostgreSQL" || v3["name"] == "Template") {
							content := v3["content"].(string)
							return body{http.StatusOK, content, apiResponses}
						}
					}
				}
			}
		}
		return body{http.StatusNotFound, "", apiResponses}
	}
}

// urlSkipper ignores metrics route on some middleware
func urlSkipper(c echo.Context) bool {
	if strings.HasPrefix(c.Path(), "/favicon.ico") {
		return true
	}
	return false
}

func api(cmd *cobra.Command, args []string) {
	endpoints = map[string]map[string]string{}
	dbs = map[string]*sql.DB{}
	dynamicEndpoints = map[string]response{}
	bytes, err := os.ReadFile("tuna-mayonnaise.json")
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
		if node["name"] == "MySQL" || node["name"] == "PostgreSQL" {
			data := node["data"].(map[string]interface{})
			user := data["user"].(string)
			host := data["host"].(string)
			port := data["port"].(string)
			dbName := data["db"].(string)

			passEnv := strings.ToUpper(dbName) + "_PASS_ON_" + strings.ToUpper(user)
			pass, ret := os.LookupEnv(passEnv)
			if ret == false {
				log.Fatal(passEnv + " is not found, set this env.")
			}
			uniqueKey := fmt.Sprintf("%s_%s_%s_%s", user, host, port, dbName)
			if _, ok := dbs[uniqueKey]; ok {
				continue
			}
			var db *sql.DB
			var err error
			if node["name"] == "MySQL" {
				tls := data["tls"].(string)
				dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?tls=%s", user, pass, host, port, dbName, tls)
				db, err = sql.Open("mysql", dsn)
			} else {
				sslmode := data["sslmode"].(string)
				dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", host, port, user, pass, dbName, sslmode)
				db, err = sql.Open("postgres", dsn)
			}
			if err != nil {
				log.Fatal(err.Error())
			}
			dbs[uniqueKey] = db
		}
	}

	// Echo instance
	e := echo.New()
	e.HideBanner = true
	e.HidePort = true

	// restClient initialize
	client = &http.Client{
		Transport: &http.Transport{MaxIdleConnsPerHost: 32},
		Timeout:   time.Second * 5,
	}

	// Prometheus
	isPromEnabled, promRet = os.LookupEnv("PROM")
	if promRet == false {
		isPromEnabled = "ON"
	}
	if isPromEnabled != "OFF" {
		reqAPICnt := &prom.Metric{
			ID:          "reqAPICnt",
			Name:        "requests_api_total",
			Description: "How many HTTP requests to APIs processed, partitioned by status code and HTTP method.",
			Type:        "counter_vec",
			Args:        []string{"code", "method", "url"}}
		p := prom.NewPrometheus("tuna", urlSkipper, []*prom.Metric{reqAPICnt})
		dynamicEndpointCounter = reqAPICnt.MetricCollector.(*prometheus.CounterVec)
		p.Use(e)
	}

	// LTSV Logger
	logger := middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: logFormat(),
		Output: os.Stdout,
	})
	e.Use(logger)

	// Middlewares
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Route => handler
	e.GET("/health", func(ctx echo.Context) error {
		return ctx.String(http.StatusOK, "OK")
	})
	for path := range endpoints {
		e.GET(path, endpointHandler)
	}
	for path := range dynamicEndpoints {
		e.GET(path, dynamicEndpointHandler)
	}

	// Start server
	port, ret := os.LookupEnv("PORT")
	if ret == false {
		port = "8080"
	}
	e.Logger.Fatal(e.Start(":" + port))

	for _, db := range dbs {
		defer db.Close()
	}
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
