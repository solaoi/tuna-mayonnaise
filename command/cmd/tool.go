package cmd

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/spf13/cobra"
)

var toolCmd = &cobra.Command{
	Use:   "tool",
	Short: "Open TUNA-Mayonnaise Tool",
	Long: `Open TUNA-Mayonnaise Tool

This command open TUNA-Mayonnaise Tool UI.
this tool simplify your workflow on Landing Page and API.

open localhost:3000`,
	Run: tool,
}

func openbrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
}

//go:embed static/*
var content embed.FS
var contentHandler = echo.WrapHandler(http.FileServer(http.FS(content)))
var contentRewrite = middleware.Rewrite(map[string]string{"/*": "/static/$1"})

func exportJSON(m map[string]interface{}) error {
	file, err := os.Create("tuna-mayonnaise.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	json, err := json.Marshal(m)
	if err != nil {
		log.Fatal(err)
	}
	file.Write(([]byte)(json))
	return nil
}

func jsonExportHandler(c echo.Context) error {
	m := echo.Map{}
	if err := c.Bind(&m); err != nil {
		return err
	}
	exportJSON(m)
	return c.String(http.StatusCreated, "Created")
}

func tool(cmd *cobra.Command, args []string) {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.GET("/*", contentHandler, contentRewrite)
	e.POST("/regist", jsonExportHandler)
	openbrowser("http://localhost:3000")
	e.Logger.Fatal(e.Start(":3000"))
}

func init() {
	rootCmd.AddCommand(toolCmd)
}
