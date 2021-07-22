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
	"github.com/common-nighthawk/go-figure"
)

var toolCmd = &cobra.Command{
	Use:   "tool",
	Short: "Open this editor",
	Long: `Open this editor

This command launch a browser and you get a power to generate JSON/HTML APIs`,
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
	file.Write(json)
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
	// Show this tool name
	myFigure := figure.NewFigure("TUNA", "", true)
  	myFigure.Print()

	// Echo instance
	e := echo.New()
	e.HideBanner = true

	// Middleware
	// e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Route => handler
	e.File("/tuna-configuration", "tuna-mayonnaise.json")
	e.GET("/*", contentHandler, contentRewrite)
	e.POST("/regist", jsonExportHandler)

	// Open browser
	openbrowser("http://localhost:3000")

	// Start server
	e.Logger.Fatal(e.Start(":3000"))
}

func init() {
	rootCmd.AddCommand(toolCmd)
}
