package agentarr

import (
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var clearTorrentsCmd = cobra.Command{
	Use:   "clear-torrents",
	Short: "Clear Torrents",
	RunE: func(cmd *cobra.Command, args []string) error {
		handlers.ClearTorrents()
		return nil
	},
}

func init() {
	rootCmd.AddCommand(&clearTorrentsCmd)
}
