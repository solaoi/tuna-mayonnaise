package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/fatih/color"
	"github.com/rodaine/table"
	"github.com/spf13/cobra"
)

var (
	static = true
	enabled = true
	showCmd       = &cobra.Command{
		Use:   "show",
		Short: "Show all endpoints",
		Long:  ``,
		Run:   show,
	}
)

func show(cmd *cobra.Command, args []string) {
	endpoints = map[string]map[string]string{}
	bytes, err := os.ReadFile("tuna-mayonnaise.json")
	if err != nil {
		log.Fatal(err)
	}
	var objmap map[string]interface{}
	if err := json.Unmarshal(bytes, &objmap); err != nil {
		log.Fatal(err)
	}

	headerFmt := color.New(color.FgGreen, color.Underline).SprintfFunc()
	columnFmt := color.New(color.FgYellow).SprintfFunc()

	tbl := table.New("Path", "Method", "Static", "Enabled")
	tbl.WithHeaderFormatter(headerFmt).WithFirstColumnFormatter(columnFmt)

	nodes := objmap["nodes"].(map[string]interface{})
	for _, v := range nodes {
		node := v.(map[string]interface{})
		if node["name"] == "Endpoint" {
			var contents = map[int]map[string]map[string]interface{}{}
			isDynamic := false
			data := node["data"].(map[string]interface{})
			path := data["path"].(string)
			id := fmt.Sprint(node["id"])
			setContents(nodes, id, 0, "0", contents, &isDynamic)
			enabledFlag := data["enabledFlag"].(bool)
			tbl.AddRow(path, "GET", !isDynamic, enabledFlag)
		}
	}
	tbl.Print()
}

func init() {
	rootCmd.AddCommand(showCmd)
}
