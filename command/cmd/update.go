package cmd

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/blang/semver"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
	"github.com/spf13/cobra"
)

var selfUpdateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update this tool",
	Run:   confirmAndSelfUpdate,
}

func confirmAndSelfUpdate(cmd *cobra.Command, args []string) {
	latest, found, err := selfupdate.DetectLatest("solaoi/tuna-mayonnaise")
	if err != nil {
		log.Println("Error occurred while detecting version:", err)
		return
	}

	if version == "dev" {
		log.Println("No version on development mode")
		return
	}

	trimmed := strings.TrimPrefix(version, "v")
	v := semver.MustParse(trimmed)
	if !found || latest.Version.LTE(v) {
		log.Println("Current version is the latest")
		return
	}

	fmt.Print("Do you want to update to ", latest.Version, "? (y/n): ")
	input, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil || (input != "y\n" && input != "n\n") {
		log.Println("Invalid input")
		return
	}
	if input == "n\n" {
		return
	}

	exe, err := os.Executable()
	if err != nil {
		log.Println("Could not locate executable path")
		return
	}
	if err := selfupdate.UpdateTo(latest.AssetURL, exe); err != nil {
		log.Println("Error occurred while updating binary:", err)
		return
	}
	log.Println("Successfully updated to version", latest.Version)
}

func init() {
	rootCmd.AddCommand(selfUpdateCmd)
}
