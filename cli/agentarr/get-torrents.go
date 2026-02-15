package agentarr

import (
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var listTorrentsCmd = cobra.Command{
	Use:   "torrents",
	Short: "List Torrents",
	RunE: func(cmd *cobra.Command, args []string) error {
		handlers.GetTorrents()
		return nil
	},
}

func init() {
	rootCmd.AddCommand(&listTorrentsCmd)
}
