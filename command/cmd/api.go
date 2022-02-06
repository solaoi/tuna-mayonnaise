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
	"reflect"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/aymerick/raymond"
	"github.com/eknkc/pug"
	// valid usage.
	_ "github.com/go-sql-driver/mysql"
	"github.com/kpango/gache"
	prom "github.com/labstack/echo-contrib/prometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	// valid usage.
	_ "github.com/lib/pq"
	"github.com/mohae/deepcopy"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/solaoi/tuna-mayonnaise/cmd/config"
	"github.com/spf13/cobra"
)

var (
	apiPort   = 8080
	noMetrics = false
)

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Serve APIs generated on this tool command",
	Long: `Serve APIs generated on this tool command

This command serves endpoints you generated on this tool commnad.`,
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

type staticResponse struct {
	ContentType string
	Content     string
}

type dynamicResponse struct {
	ContentType    string
	ContentBuilder func() body
}

type ratelimitConfig struct {
	enable       bool
	unit         string
	limit        float64
	burst        float64
	expireSecond float64
}

type staticEndpointContent struct {
	method string
	staticResponse
	ratelimitConfig
}

type dynamicEndpointContent struct {
	method string
	dynamicResponse
	ratelimitConfig
}

var re *regexp.Regexp
var reIsNum *regexp.Regexp
var staticEndpoints map[string]staticEndpointContent
var dbs map[string]*sql.DB

func isJSONNode(name string) bool {
	return name == "JSON" || name == "API" || name == "MySQL" || name == "PostgreSQL" || name == "JSONManager"
}

func isJSONorHTMLNode(name string) bool {
	return isJSONNode(name) || name == "Template"
}

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, staticEndpoints[c.Path()].ContentType, []byte(staticEndpoints[c.Path()].Content))
}

var dynamicEndpoints map[string]dynamicEndpointContent
var reqAPICounter *prometheus.CounterVec
var reqDBCounter *prometheus.CounterVec

func dynamicEndpointHandler(c echo.Context) error {
	body := dynamicEndpoints[c.Path()].ContentBuilder()
	if !noMetrics {
		for _, v := range body.APIResponses {
			if reqAPICounter != nil {
				reqAPICounter.WithLabelValues(v.StatusCode, v.Method, v.URL).Inc()
			}
		}
	}
	return c.Blob(body.StatusCode, dynamicEndpoints[c.Path()].ContentType, []byte(body.Content))
}

func findNext(node map[string]interface{}) (name string, content interface{}, nexts []string) {
	name = node["name"].(string)
	data := node["data"].(map[string]interface{})

	if name == "API" {
		content = map[string]interface{}{"method": data["method"], "url": data["url"], "cached": data["cached"], "cacheTime": data["cacheTime"]}
	} else if name == "MySQL" || name == "PostgreSQL" {
		content = map[string]interface{}{"host": data["host"], "port": data["port"], "user": data["user"], "db": data["db"], "cached": data["cached"], "cacheTime": data["cacheTime"]}
	} else if name == "JSONManager" {
		content = map[string]interface{}{"content": data["output"], "functions": data["outputFunctions"]}
	} else {
		content = data["output"]
	}
	inputs := node["inputs"].(map[string]interface{})
	for _, v := range inputs {
		input := v.(map[string]interface{})
		connections := input["connections"].([]interface{})
		for _, v2 := range connections {
			connection := v2.(map[string]interface{})
			nexts = append(nexts, fmt.Sprint(connection["node"]))
		}
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
	return func() (content body) {
		var apiResponses []apiResponse
		c := deepcopy.Copy(contents).(map[int]map[string]map[string]interface{})
		for i := len(c) - 1; i >= 0; i-- {
			for k, v := range c[i] {
				if v["name"] == "API" {
					content := v["content"].(map[string]interface{})
					url := fmt.Sprintf("%v", content["url"])
					cached := fmt.Sprintf("%v", content["cached"])
					method := fmt.Sprintf("%v", content["method"])

					if cached == "true" {
						v, ok := gache.Get(url)
						if ok {
							apiResponses = append(apiResponses, apiResponse{method, url, "cached"})
							c[i][k]["content"] = v
							continue
						}
					}

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
					if cached == "true" {
						cacheTime := fmt.Sprintf("%v", content["cacheTime"])
						if cacheTime == "" {
							gache.Set(url, res)
						} else {
							cacheTime, err := strconv.Atoi(cacheTime)
							if err != nil {
								gache.Set(url, res)
							} else {
								gache.SetWithExpire(url, res, time.Second*time.Duration(cacheTime))
							}
						}
					}
					c[i][k]["content"] = res
				} else if v["name"] == "MySQL" || v["name"] == "PostgreSQL" {
					content := v["content"].(map[string]interface{})
					user := fmt.Sprintf("%v", content["user"])
					host := fmt.Sprintf("%v", content["host"])
					port := fmt.Sprintf("%v", content["port"])
					dbName := fmt.Sprintf("%v", content["db"])
					uniqueKey := fmt.Sprintf("%s_%s_%s_%s", user, host, port, dbName)
					cached := fmt.Sprintf("%v", content["cached"])

					query := ""
					dummyJSON := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							if v1["name"] == "SQL" {
								query = v1["content"].(string)
							} else if v1["name"] == "JSON" {
								dummyJSON = v1["content"].(string)
							}
						}
					}
					if query == "" || dummyJSON == "" {
						log.Fatal("set sql params on tool...")
					}
					cacheKey := fmt.Sprintf("%s_%s", uniqueKey, query)

					if cached == "true" {
						v, ok := gache.Get(cacheKey)
						if ok {
							c[i][k]["content"] = v
							continue
						}
					}

					db := dbs[uniqueKey]
					rows, err := db.Query(query)
					if err != nil {
						reqDBCounter.WithLabelValues(err.Error()).Inc()
						return body{http.StatusInternalServerError, "", []apiResponse{}}
					}
					defer rows.Close()
					dummy := []map[string]json.RawMessage{}
					errJSON := json.Unmarshal([]byte(dummyJSON), &dummy)
					if errJSON != nil {
						log.Fatal(errJSON)
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
					res := string(json)
					if cached == "true" {
						cacheTime := fmt.Sprintf("%v", content["cacheTime"])
						if cacheTime == "" {
							gache.Set(cacheKey, res)
						} else {
							cacheTime, err := strconv.Atoi(cacheTime)
							if err != nil {
								gache.Set(cacheKey, res)
							} else {
								gache.SetWithExpire(cacheKey, res, time.Second*time.Duration(cacheTime))
							}
						}
					}
					c[i][k]["content"] = res
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
						} else if v2["parent"] == k && isJSONNode(v2["name"].(string)) {
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
				} else if v["name"] == "JSONManager" {
					temp := v["content"].(map[string]interface{})
					content := fmt.Sprintf("%v", temp["content"])
					functions := fmt.Sprintf("%v", temp["functions"])
					var obj []map[string]interface{}
					newObj := map[string]interface{}{}
					if err := json.Unmarshal([]byte(content), &obj); err != nil {
						log.Fatal(err)
					}

					ctxArray := map[int]map[string]interface{}{}
					ctxsArray := map[int][]map[string]interface{}{}
					ctxsSimpleArray := map[int][]string{}
					for k2, v2 := range c[i+1] {
						if v2["parent"] == k && isJSONNode(v2["name"].(string)) {
							ctx := map[string]interface{}{}
							ctxs := []map[string]interface{}{}
							ctxsSimple := []string{}
							id, _ := strconv.Atoi(k2)
							if strings.HasPrefix(v2["content"].(string), "[") {
								if strings.Contains(v2["content"].(string), "{") && strings.Contains(v2["content"].(string), "}") {
									json.Unmarshal([]byte(v2["content"].(string)), &ctxs)
									ctxsArray[id] = ctxs
								} else {
									json.Unmarshal([]byte(v2["content"].(string)), &ctxsSimple)
									ctxsSimpleArray[id] = ctxsSimple
								}
							} else {
								json.Unmarshal([]byte(v2["content"].(string)), &ctx)
								ctxArray[id] = ctx
							}
						}
					}
					srcMap := map[int]int{}
					for _, v2 := range obj {
						id := int(v2["src"].(float64))
						if id > 0 {
							srcMap[id] = int(v2["srcId"].(float64))
						} else {
							srcIds := v2["srcIds"].(string)
							if srcIds != "" {
								arr := strings.Split(srcIds, ",")
								for _, keyValue := range arr {
									arr2 := strings.Split(keyValue, ":")
									key, _ := strconv.Atoi(arr2[0])
									val, _ := strconv.Atoi(arr2[1])
									srcMap[key] = val
								}
							}
						}
					}
					for _, v2 := range obj {
						key := v2["key"].(string)
						id := int(v2["srcId"].(float64))
						if id == -1 {
							var funcJSON []map[string]interface{}
							if err := json.Unmarshal([]byte(functions), &funcJSON); err != nil {
								log.Fatal(err)
							}
							for _, v4 := range funcJSON {
								funcName := v4["name"].(string)
								if funcName == key {
									funcType := v4["func"].(string)
									funcParams := v4["params"].([]interface{})
									if funcType == "Naming" {
										param1 := funcParams[0].(string)
										if strings.HasPrefix(param1, "inputs[") {
											matched := re.FindStringSubmatch(param1)
											tempKey := matched[4]
											inputIndex, _ := strconv.Atoi(matched[1])
											nodeID := srcMap[inputIndex]
											if len(ctxsArray[nodeID]) == 0 && len(ctxsSimpleArray[nodeID]) == 0 {
												newObj[key] = ctxArray[nodeID][tempKey]
											} else {
												if reIsNum.MatchString(tempKey) {
													index, err := strconv.Atoi(tempKey)
													if err != nil {
														log.Fatal(err)
													} else {
														if len(ctxsSimpleArray[nodeID]) == 0 {
															newObj[key] = ctxsArray[nodeID][index]
														} else {
															newObj[key] = ctxsSimpleArray[nodeID][index]
														}
													}
												} else {
													if tempKey != "" {
														newObj[key] = ctxArray[nodeID][tempKey]
													} else {
														if len(ctxsSimpleArray[nodeID]) == 0 {
															newObj[key] = ctxsArray[nodeID]
														} else {
															newObj[key] = ctxsSimpleArray[nodeID]
														}
													}
												}
											}
										} else {
											newObj[key] = param1
										}
									} else if funcType == "1000 Separate" {
										// ctxsArray, ctxsSimpleArrayのケースを記載する
										param1 := funcParams[0].(string)
										var unSeparated string
										if strings.HasPrefix(param1, "inputs[") {
											matched := re.FindStringSubmatch(param1)
											tempKey := matched[4]
											inputIndex, _ := strconv.Atoi(matched[1])
											nodeID := srcMap[inputIndex]
											// tempKeyが空ケースを記載する
											if reflect.TypeOf(ctxArray[nodeID][tempKey]).Kind() == reflect.String {
												unSeparated = ctxArray[nodeID][tempKey].(string)
											} else {
												unSeparated = strconv.FormatFloat(ctxArray[nodeID][tempKey].(float64), 'f', -1, 64)
											}
										} else {
											unSeparated = param1
										}
										arrSeparatedByDot := strings.Split(unSeparated, ".")
										arr := strings.Split(arrSeparatedByDot[0], "")
										cnt := len(arr) - 1
										res := ""
										i2 := 0
										for i := cnt; i >= 0; i-- {
											if i2 > 2 && i2%3 == 0 {
												res = fmt.Sprintf(",%s", res)
											}
											res = fmt.Sprintf("%s%s", arr[i], res)
											i2++
										}
										if len(arrSeparatedByDot) == 2 {
											newObj[key] = res + arrSeparatedByDot[1]
										} else {
											newObj[key] = res
										}
									} else if funcType != "Naming" && funcType != "1000 Separate" {
										newObj[key] = nil
									}
								}
							}
						} else {
							newObj[key] = ctxArray[id][key]
						}
					}

					json, err := json.Marshal(newObj)
					if err != nil {
						log.Fatal(err)
					}
					c[i][k]["content"] = string(json)
				} else if v["name"] == "Endpoint" {
					for _, v3 := range c[i+1] {
						if v3["parent"] == k && isJSONorHTMLNode(v3["name"].(string)) {
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
	return strings.HasPrefix(c.Path(), "/favicon.ico")
}

func api(cmd *cobra.Command, args []string) {
	re = regexp.MustCompile(`^inputs\[(\d+)\](([^.]?)|\.(.*))$`)
	reIsNum = regexp.MustCompile(`^\d+$`)
	staticEndpoints = map[string]staticEndpointContent{}
	dbs = map[string]*sql.DB{}
	dynamicEndpoints = map[string]dynamicEndpointContent{}
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
			method := data["method"].(string)
			path := data["path"].(string)
			contentType := data["contentType"].(string)
			// ratelimit config
			ratelimitEnableFlag := data["ratelimitEnableFlag"].(bool)
			ratelimitUnit := data["ratelimitUnit"].(string)
			ratelimitLimit := data["ratelimitLimit"].(float64)
			ratelimitBurst := data["ratelimitBurst"].(float64)
			ratelimitExpireSecond := data["ratelimitExpireSecond"].(float64)

			id := fmt.Sprint(node["id"])
			setContents(nodes, id, 0, "0", contents, &isDynamic)

			if data["enabledFlag"].(bool) {
				if !isDynamic {
					content := data["content"].(string)
					if ratelimitEnableFlag {
						staticEndpoints[path] = staticEndpointContent{method, staticResponse{contentType, content}, ratelimitConfig{true, ratelimitUnit, ratelimitLimit, ratelimitBurst, ratelimitExpireSecond}}
					} else {
						staticEndpoints[path] = staticEndpointContent{method, staticResponse{contentType, content}, ratelimitConfig{false, "any", 0, 0, 0}}
					}
				} else {
					if ratelimitEnableFlag {
						dynamicEndpoints[path] = dynamicEndpointContent{method, dynamicResponse{contentType, contentBuilder(contents)}, ratelimitConfig{true, ratelimitUnit, ratelimitLimit, ratelimitBurst, ratelimitExpireSecond}}
					} else {
						dynamicEndpoints[path] = dynamicEndpointContent{method, dynamicResponse{contentType, contentBuilder(contents)}, ratelimitConfig{false, "any", 0, 0, 0}}
					}
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
			if !ret {
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
	if !noMetrics {
		reqAPICnt := &prom.Metric{
			ID:          "reqAPICnt",
			Name:        "requests_api_total",
			Description: "How many HTTP requests to APIs processed, partitioned by status code and HTTP method.",
			Type:        "counter_vec",
			Args:        []string{"code", "method", "url"}}
		reqDBCnt := &prom.Metric{
			ID:          "reqDBCnt",
			Name:        "requests_db_total",
			Description: "How many HTTP requests to APIs processed, partitioned by status code and HTTP method.",
			Type:        "counter_vec",
			Args:        []string{"error"}}
		p := prom.NewPrometheus("tuna", urlSkipper, []*prom.Metric{reqAPICnt, reqDBCnt})
		reqAPICounter = reqAPICnt.MetricCollector.(*prometheus.CounterVec)
		reqDBCounter = reqDBCnt.MetricCollector.(*prometheus.CounterVec)
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

	for path, endpointContent := range staticEndpoints {
		method := endpointContent.method
		if endpointContent.ratelimitConfig.enable {
			unit := endpointContent.ratelimitConfig.unit
			limit := endpointContent.ratelimitConfig.limit
			burst := endpointContent.ratelimitConfig.burst
			expireSecond := endpointContent.ratelimitConfig.expireSecond
			e.Match([]string{method}, path, endpointHandler, middleware.RateLimiterWithConfig(config.GetRateLimiterConfig(unit, limit, burst, expireSecond)))
		} else {
			e.Match([]string{method}, path, endpointHandler)
		}
	}
	for path, endpointContent := range dynamicEndpoints {
		method := endpointContent.method
		if endpointContent.ratelimitConfig.enable {
			unit := endpointContent.ratelimitConfig.unit
			limit := endpointContent.ratelimitConfig.limit
			burst := endpointContent.ratelimitConfig.burst
			expireSecond := endpointContent.ratelimitConfig.expireSecond
			e.Match([]string{method}, path, dynamicEndpointHandler, middleware.RateLimiterWithConfig(config.GetRateLimiterConfig(unit, limit, burst, expireSecond)))
		} else {
			e.Match([]string{method}, path, dynamicEndpointHandler)
		}
	}

	// Start server
	apiPort := strconv.Itoa(apiPort)
	e.Logger.Fatal(e.Start(":" + apiPort))

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
	apiCmd.Flags().BoolVarP(&noMetrics, "no-metrics", "x", false, "Do not collect the prometheus metrics on /metrics")
	apiCmd.Flags().IntVarP(&apiPort, "port", "p", 8080, "Port to use")
	rootCmd.AddCommand(apiCmd)
}
