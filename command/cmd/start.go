package cmd

import (
	"runtime"
	"fmt"
	"os/exec"
	"path"
	"os"
	"log"

	"github.com/spf13/cobra"

	"github.com/solaoi/tuna-mayonnaise/lib"
    "github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/solaoi/tuna-mayonnaise/static"
)

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "generate JSON with form and form-template",
	Long: `generate JSON with form and form-template.

This command launches our default browser with --open option
and gives us a simple solution to generate JSON.`,
	Run: start,
}

func start(cmd *cobra.Command, args []string) {
	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	var tunaMayonnaiseDir = path.Join(currentDir, ".tm")
	if f, err := os.Stat(tunaMayonnaiseDir); os.IsNotExist(err) || !f.IsDir() {
		log.Fatal("we should run tm init at first")
	}

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.POST("/query", func(c echo.Context) error {
		return nil
	})

	e.GET("/playground", func(c echo.Context) error {
		return nil
	})

	e.Use(lib.ServeRoot("/", NewAssets("out")))

	if b, err := cmd.Flags().GetBool("open"); err == nil && b {
		openbrowser("http://localhost:3000/")
	}

	err = e.Start(":3000")
	if err != nil {
		log.Fatalln(err)
	}
}

func NewAssets(root string) *assetfs.AssetFS {
    return &assetfs.AssetFS{
        Asset:     static.Asset,
        AssetDir:  static.AssetDir,
        AssetInfo: static.AssetInfo,
        Prefix:    root,
    }
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

func init() {
	rootCmd.AddCommand(startCmd)
	startCmd.Flags().BoolP("open", "o", false, "open browser automatically")
}
