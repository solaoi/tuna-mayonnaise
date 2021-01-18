package cmd

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

func endpointHandler(c echo.Context) error {
	return c.Blob(http.StatusOK, endpoints[c.Path()]["contentType"], []byte(endpoints[c.Path()]["content"]))
}

func api(cmd *cobra.Command, args []string) {
	endpoints = map[string]map[string]string{}
	bytes, err := ioutil.ReadFile("tuna-mayonnaise.json")
	if err != nil {
		log.Fatal(err)
	}
	var objmap map[string]interface{}
	if err := json.Unmarshal(bytes, &objmap); err != nil {
		log.Fatal(err)
	}
	nodes, ok := objmap["nodes"].(map[string]interface{})
	if !ok {
		log.Fatal("tuna-mayonnaise.json is invalid format...")
	}
	for _, v := range nodes {
		node, ok := v.(map[string]interface{})
		if !ok {
			log.Fatal("tuna-mayonnaise.json is invalid format...")
		}
		if node["name"] == "Endpoint" {
			data, ok := node["data"].(map[string]interface{})
			if !ok {
				log.Fatal("tuna-mayonnaise.json is invalid format...")
			}
			path, ok := data["path"].(string)
			if !ok {
				log.Fatal("tuna-mayonnaise.json is invalid format...")
			}
			content, ok := data["content"].(string)
			if !ok {
				log.Fatal("tuna-mayonnaise.json is invalid format...")
			}
			contentType, ok := data["contentType"].(string)
			if !ok {
				log.Fatal("tuna-mayonnaise.json is invalid format...")
			}
			endpoints[path] = map[string]string{"content": content, "contentType": contentType}
		}
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	for path := range endpoints {
		e.GET(path, endpointHandler)
	}
	e.Logger.Fatal(e.Start(":8080"))
}

func init() {
	rootCmd.AddCommand(apiCmd)
}
