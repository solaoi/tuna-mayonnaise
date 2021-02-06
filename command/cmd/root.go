package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var cfgFile string

var rootCmd = &cobra.Command{
	Use:   "tuna",
	Short: "TUNA-Mayonnaise is a CommandLineTool to generate and serve JSON/HTML with Visual Programming.",
	Long: `TUNA-Mayonnaise is a CommandLineTool to generate and serve JSON/HTML with Visual Programming.
Complete documentation is available at https://github.com/solaoi/tuna-mayonnaise`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
