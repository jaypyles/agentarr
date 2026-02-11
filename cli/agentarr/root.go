package agentarr

import (
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "agentarr",
	Short: "Agentarr CLI",
	Long:  "Agentarr CLI for interacting with the Agentarr API",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
