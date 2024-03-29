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
	"strconv"
	"strings"
	"time"

	"github.com/aymerick/raymond"
	"github.com/eknkc/pug"
	// valid usage.
	_ "github.com/go-sql-driver/mysql"
	"github.com/iancoleman/orderedmap"
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
	// valid usage.
	_ "github.com/mattn/go-sqlite3"
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
	ContentBuilder func(request *http.Request) body
	HasError       bool
	ErrorContent   string
}

type ratelimitConfig struct {
	enable       bool
	unit         string
	limit        float64
	burst        float64
	expireSecond float64
}

type staticEndpointContent struct {
	method           string
	botblockerEnable bool
	staticResponse
	ratelimitConfig
}

type dynamicEndpointContent struct {
	method           string
	botblockerEnable bool
	dynamicResponse
	ratelimitConfig
}

type redirectEndpointContent struct {
	destinationURL string
}

var re *regexp.Regexp
var reIsNum *regexp.Regexp
var staticEndpoints map[string]staticEndpointContent
var dbs map[string]*sql.DB

func isDBNode(name string) bool {
	return name == "MySQL" || name == "PostgreSQL" || name == "SQLite"
}

func isJSONNode(name string) bool {
	return isDBNode(name) || name == "JSON" || name == "DummyJSON" || name == "API" || name == "JSONManager" || name == "Request"
}

func isJSONorHTMLNode(name string) bool {
	return isJSONNode(name) || name == "Template"
}

func isSQLInjectionParams(value string) bool {
	regs := [...]*regexp.Regexp{
		regexp.MustCompile(`(%27)|(')|(--)|(%23)|(#)`),
		regexp.MustCompile(`((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))`),
		regexp.MustCompile(`w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))`),
		regexp.MustCompile(`((%27)|('))union`),
	}
	val := strings.ToLower(value)
	for _, reg := range regs {
		isSQLInjection := reg.MatchString(val)
		if isSQLInjection {
			return true
		}
	}
	return false
}

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, staticEndpoints[c.Path()].ContentType, []byte(staticEndpoints[c.Path()].Content))
}

var redirectEndpoints map[string]redirectEndpointContent
var dynamicEndpoints map[string]dynamicEndpointContent
var reqAPICounter *prometheus.CounterVec
var reqDBCounter *prometheus.CounterVec
var botBlockCounter *prometheus.CounterVec

func dynamicEndpointHandler(c echo.Context) error {
	body := dynamicEndpoints[c.Path()].ContentBuilder(c.Request())
	if !noMetrics {
		for _, v := range body.APIResponses {
			if reqAPICounter != nil {
				reqAPICounter.WithLabelValues(v.StatusCode, v.Method, v.URL).Inc()
			}
		}
	}
	if dynamicEndpoints[c.Path()].HasError && body.StatusCode != http.StatusOK {
		return c.Blob(http.StatusOK, dynamicEndpoints[c.Path()].ContentType, []byte(dynamicEndpoints[c.Path()].ErrorContent))
	}
	return c.Blob(body.StatusCode, dynamicEndpoints[c.Path()].ContentType, []byte(body.Content))
}

func findNext(node map[string]interface{}) (name string, content interface{}, nexts []string) {
	name = node["name"].(string)
	data := node["data"].(map[string]interface{})

	if name == "API" {
		content = map[string]interface{}{"method": data["method"], "headers": data["headers"], "cached": data["cached"], "cacheTime": data["cacheTime"]}
	} else if name == "MySQL" || name == "PostgreSQL" {
		content = map[string]interface{}{"host": data["host"], "port": data["port"], "user": data["user"], "db": data["db"], "cached": data["cached"], "cacheTime": data["cacheTime"]}
	} else if name == "SQLite" {
		content = map[string]interface{}{"filename": data["filename"], "cached": data["cached"], "cacheTime": data["cacheTime"]}
	} else if name == "JSONManager" {
		content = map[string]interface{}{"content": data["output"], "functions": data["outputFunctions"]}
	} else if name == "Request" {
		content = map[string]interface{}{"type": data["type"]}
	} else {
		content = data["output"]
	}
	inputs := node["inputs"].(map[string]interface{})
	if name == "EndpointWithError" {
		input := inputs["content"].(map[string]interface{})
		connections := input["connections"].([]interface{})
		for _, v2 := range connections {
			connection := v2.(map[string]interface{})
			nexts = append(nexts, fmt.Sprint(connection["node"]))
		}
	} else {
		for _, v := range inputs {
			input := v.(map[string]interface{})
			connections := input["connections"].([]interface{})
			for _, v2 := range connections {
				connection := v2.(map[string]interface{})
				nexts = append(nexts, fmt.Sprint(connection["node"]))
			}
		}
	}

	return
}

func setContents(nodes map[string]interface{}, id string, depth int, parent string, contents map[int]map[string]map[string]interface{}, isDynamic *bool) {
	node := nodes[id].(map[string]interface{})
	name, content, nexts := findNext(node)
	if !*isDynamic && (name == "API" || isDBNode(name) || name == "Request") {
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

func contentBuilder(contents map[int]map[string]map[string]interface{}) func(request *http.Request) (content body) {
	return func(request *http.Request) (content body) {
		var apiResponses []apiResponse
		c := deepcopy.Copy(contents).(map[int]map[string]map[string]interface{})
		for i := len(c) - 1; i >= 0; i-- {
			for k, v := range c[i] {
				if v["name"] == "API" {
					content := v["content"].(map[string]interface{})
					headers := fmt.Sprintf("%v", content["headers"])
					cached := fmt.Sprintf("%v", content["cached"])
					method := fmt.Sprintf("%v", content["method"])
					url := ""
					query := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							if v1["name"] == "URL" || v1["name"] == "URLWithPathParam" {
								url = v1["content"].(string)
							} else if v1["name"] != "DummyJSON" {
								query = v1["content"].(string)
							}
						}
					}

					if cached == "true" {
						v, ok := gache.Get(url + query)
						if ok {
							apiResponses = append(apiResponses, apiResponse{method, url, "cached"})
							c[i][k]["content"] = v
							continue
						}
					}

					req, _ := http.NewRequest(method, url, nil)
					if query != "" {
						params := request.URL.Query()
						tmp := map[string]string{}
						err := json.Unmarshal([]byte(query), &tmp)
						if err != nil {
							log.Fatal(err)
						}
						for k, v := range tmp {
							params.Add(k, v)
						}
						req.URL.RawQuery = params.Encode()
					}
					if headers != "" {
						tmp := map[string]string{}
						err := json.Unmarshal([]byte(headers), &tmp)
						if err != nil {
							log.Fatal(err)
						}
						for k, v := range tmp {
							req.Header.Set(k, v)
						}
					}
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
							gache.Set(url+query, res)
						} else {
							cacheTime, err := strconv.Atoi(cacheTime)
							if err != nil {
								log.Fatal(err)
							} else {
								gache.SetWithExpire(url+query, res, time.Second*time.Duration(cacheTime))
							}
						}
					}
					c[i][k]["content"] = res
				} else if v["name"] == "URLWithPathParam" {
					unformattedURL := v["content"].(string)
					pathParams := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							pathParams = v1["content"].(string)
						}
					}
					if pathParams != "" {
						tmp := map[string]string{}
						err := json.Unmarshal([]byte(pathParams), &tmp)
						if err != nil {
							return body{http.StatusBadRequest, "", []apiResponse{}}
						}
						for k, v := range tmp {
							unformattedURL = strings.ReplaceAll(unformattedURL, ":"+k, v)
						}
					}
					c[i][k]["content"] = unformattedURL
				} else if v["name"] == "SqlWithPlaceHolder" {
					unformattedSQL := v["content"].(string)
					placeHolderParams := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							placeHolderParams = v1["content"].(string)
						}
					}
					if placeHolderParams != "" {
						tmp := map[string]string{}
						err := json.Unmarshal([]byte(placeHolderParams), &tmp)
						dbType := "Common"
						if err != nil {
							if reqDBCounter != nil {
								reqDBCounter.WithLabelValues(dbType, err.Error()).Inc()
							}
							return body{http.StatusBadRequest, "", []apiResponse{}}
						}
						for k, v := range tmp {
							if isSQLInjectionParams(v) {
								if reqDBCounter != nil {
									reqDBCounter.WithLabelValues(dbType, "Reject SQL Injection: "+v).Inc()
								}
								return body{http.StatusBadRequest, "", []apiResponse{}}
							}
							unformattedSQL = strings.ReplaceAll(unformattedSQL, "${"+k+"}", v)
						}
					}
					c[i][k]["content"] = unformattedSQL
				} else if v["name"] == "Request" {
					content := v["content"].(map[string]interface{})
					requestType := fmt.Sprintf("%v", content["type"])

					if requestType == "QUERY" {
						tmp := request.URL.Query()
						unique := map[string]string{}
						// first query params duplicated is used.
						for key, values := range tmp {
							unique[key] = values[0]
						}
						json, err := json.Marshal(unique)
						if err != nil {
							return body{http.StatusBadRequest, "", apiResponses}
						}
						c[i][k]["content"] = string(json)
					} else if requestType == "COOKIE" {
						tmp := request.Cookies()
						formatted := map[string]string{}
						for _, cookie := range tmp {
							formatted[cookie.Name] = cookie.Value
						}
						json, err := json.Marshal(formatted)
						if err != nil {
							return body{http.StatusBadRequest, "", apiResponses}
						}
						c[i][k]["content"] = string(json)
					} else {
						byteArray, err := io.ReadAll(request.Body)
						if err != nil {
							return body{http.StatusBadRequest, "", apiResponses}
						}
						dummy := json.RawMessage{}
						errJSON := json.Unmarshal(byteArray, &dummy)
						if errJSON != nil {
							return body{http.StatusBadRequest, "", apiResponses}
						}
						c[i][k]["content"] = string(byteArray)
					}
				} else if isDBNode(v["name"].(string)) {
					dbType := v["name"].(string)
					content := v["content"].(map[string]interface{})
					var uniqueKey string
					if dbType == "MySQL" || dbType == "PostgreSQL" {
						user := fmt.Sprintf("%v", content["user"])
						host := fmt.Sprintf("%v", content["host"])
						port := fmt.Sprintf("%v", content["port"])
						dbName := fmt.Sprintf("%v", content["db"])
						uniqueKey = fmt.Sprintf("%s_%s_%s_%s", user, host, port, dbName)
					} else {
						uniqueKey = fmt.Sprintf("%v", content["filename"])
					}
					cached := fmt.Sprintf("%v", content["cached"])

					query := ""
					dummyJSON := ""
					for _, v1 := range c[i+1] {
						if v1["parent"] == k {
							if v1["name"] == "SQL" || v1["name"] == "SqlWithPlaceHolder" {
								query = v1["content"].(string)
							} else if v1["name"] == "DummyJSON" {
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
						if reqDBCounter != nil {
							reqDBCounter.WithLabelValues(dbType, err.Error()).Inc()
						}
						return body{http.StatusInternalServerError, "", []apiResponse{}}
					}
					defer rows.Close()
					dummy := []*orderedmap.OrderedMap{}
					errJSON := json.Unmarshal([]byte(dummyJSON), &dummy)
					if errJSON != nil {
						log.Fatal(errJSON)
					}
					keys := []string{}
					for _, k := range dummy[0].Keys() {
						keys = append(keys, k)
					}
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
				} else if v["name"] == "Endpoint" || v["name"] == "EndpointWithError" {
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
	redirectEndpoints = map[string]redirectEndpointContent{}
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
		if node["name"] == "Endpoint" || node["name"] == "EndpointWithError" {
			var contents = map[int]map[string]map[string]interface{}{}
			isDynamic := false
			data := node["data"].(map[string]interface{})
			method := data["method"].(string)
			path := data["path"].(string)
			contentType := data["contentType"].(string)
			botblockerEnable := data["botblockerEnableFlag"].(bool)
			// ratelimit config
			ratelimitEnableFlag := data["ratelimitEnableFlag"].(bool)
			ratelimitUnit := data["ratelimitUnit"].(string)
			ratelimitLimit := data["ratelimitLimit"].(float64)
			ratelimitBurst := data["ratelimitBurst"].(float64)
			ratelimitExpireSecond := data["ratelimitExpireSecond"].(float64)
			// with error json/html
			hasError := node["name"] == "EndpointWithError"
			errorContent := ""
			if hasError {
				errorContent = data["error"].(string)
			}

			id := fmt.Sprint(node["id"])
			setContents(nodes, id, 0, "0", contents, &isDynamic)

			if data["enabledFlag"].(bool) {
				if !isDynamic {
					content := data["content"].(string)
					if ratelimitEnableFlag {
						staticEndpoints[path] = staticEndpointContent{method, botblockerEnable, staticResponse{contentType, content}, ratelimitConfig{true, ratelimitUnit, ratelimitLimit, ratelimitBurst, ratelimitExpireSecond}}
					} else {
						staticEndpoints[path] = staticEndpointContent{method, botblockerEnable, staticResponse{contentType, content}, ratelimitConfig{false, "any", 0, 0, 0}}
					}
				} else {
					if ratelimitEnableFlag {
						dynamicEndpoints[path] = dynamicEndpointContent{method, botblockerEnable, dynamicResponse{contentType, contentBuilder(contents), hasError, errorContent}, ratelimitConfig{true, ratelimitUnit, ratelimitLimit, ratelimitBurst, ratelimitExpireSecond}}
					} else {
						dynamicEndpoints[path] = dynamicEndpointContent{method, botblockerEnable, dynamicResponse{contentType, contentBuilder(contents), hasError, errorContent}, ratelimitConfig{false, "any", 0, 0, 0}}
					}
				}
			}
		} else if node["name"] == "MySQL" || node["name"] == "PostgreSQL" {
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
		} else if node["name"] == "SQLite" {
			data := node["data"].(map[string]interface{})
			filename := data["filename"].(string)
			uniqueKey := filename
			db, err := sql.Open("sqlite3", fmt.Sprintf("./%s", filename))
			if err != nil {
				log.Fatal(err.Error())
			}
			dbs[uniqueKey] = db
		} else if node["name"] == "RedirectEndpoint" {
			data := node["data"].(map[string]interface{})
			path := data["path"].(string)
			url := data["url"].(string)
			if data["enabledFlag"].(bool) {
				redirectEndpoints[path] = redirectEndpointContent{url}
			}
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
			Description: "How many HTTP requests to APIs are processed, partitioned by status code and HTTP method.",
			Type:        "counter_vec",
			Args:        []string{"code", "method", "url"}}
		reqDBCnt := &prom.Metric{
			ID:          "reqDBCnt",
			Name:        "requests_db_total",
			Description: "How many errors to process a query on DBs, partitioned by db type and error name.",
			Type:        "counter_vec",
			Args:        []string{"type", "error"}}
		botBlockCnt := &prom.Metric{
			ID:          "botBlockCnt",
			Name:        "bot_block_total",
			Description: "How many bot blocks, partitioned by block reason",
			Type:        "counter_vec",
			Args:        []string{"reason"}}
		p := prom.NewPrometheus("tuna", urlSkipper, []*prom.Metric{reqAPICnt, reqDBCnt, botBlockCnt})
		reqAPICounter = reqAPICnt.MetricCollector.(*prometheus.CounterVec)
		reqDBCounter = reqDBCnt.MetricCollector.(*prometheus.CounterVec)
		botBlockCounter = botBlockCnt.MetricCollector.(*prometheus.CounterVec)
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
			if endpointContent.botblockerEnable {
				e.Match([]string{method}, path, endpointHandler, config.BotBlockerMiddleware(botBlockCounter), middleware.RateLimiterWithConfig(config.GetRateLimiterConfig(unit, limit, burst, expireSecond)))
			} else {
				e.Match([]string{method}, path, endpointHandler, middleware.RateLimiterWithConfig(config.GetRateLimiterConfig(unit, limit, burst, expireSecond)))
			}
		} else {
			if endpointContent.botblockerEnable {
				e.Match([]string{method}, path, endpointHandler, config.BotBlockerMiddleware(botBlockCounter))
			} else {
				e.Match([]string{method}, path, endpointHandler)
			}
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
	for path, endpointContent := range redirectEndpoints {
		e.GET(path, func(c echo.Context) error {
			return c.Redirect(http.StatusTemporaryRedirect, endpointContent.destinationURL)
		})
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
