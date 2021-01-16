package cmd

import (
	"os"
	"log"
	"path"
	"net/http"

	"github.com/spf13/cobra"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/solaoi/tuna-mayonnaise/lib"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "serve JSON on the public/",
	Long: `serve JSON on the public/

This command serves JSON files on the public/ .
The path served is provided in 2 ways. With the extension or not.

e.g. localhost:3000/sample.json or localhost:3000/sample`,
	Run: serve,
}

func serve(cmd *cobra.Command, args []string) {
	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	var tunaMayonnaiseDir = path.Join(currentDir, "public")
	if f, err := os.Stat(tunaMayonnaiseDir); os.IsNotExist(err) || !f.IsDir() {
		log.Fatal("there is no public dir to serve...")
	}

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.Use(lib.ServeRootSimple("/", http.Dir("public/")))
	err = e.Start(":3000")
	if err != nil {
		log.Fatalln(err)
	}
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
