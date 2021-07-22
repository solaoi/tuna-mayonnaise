package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"

	"github.com/fatih/color"
	"github.com/rodaine/table"
	"github.com/spf13/cobra"
)

var (
	static  = true
	enabled = true
	showCmd = &cobra.Command{
		Use:   "show",
		Short: "Show all endpoints generated on this tool command",
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

	tbl := table.New("Path", "Method", "ContentType", "Static", "Enabled")
	tbl.WithHeaderFormatter(headerFmt).WithFirstColumnFormatter(columnFmt)

	nodes := objmap["nodes"].(map[string]interface{})
	var keys []string
	results := map[string][4]string{}
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
			enabledFlag := data["enabledFlag"].(bool)
			results[path] = [4]string{"GET", contentType, strconv.FormatBool(!isDynamic), strconv.FormatBool(enabledFlag)}
			keys = append(keys, path)
		}
	}
	sort.Strings(keys)
	for _, key := range keys {
		tbl.AddRow(key, results[key][0], results[key][1], results[key][2], results[key][3])
	}
	tbl.Print()
}

func init() {
	rootCmd.AddCommand(showCmd)
}
