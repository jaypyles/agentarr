package agentarr

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/spf13/cobra"
)

var query string
var debug bool

var addSeriesCmd = &cobra.Command{
	Use:   "add-series",
	Short: "Add Series",
	RunE: func(cmd *cobra.Command, args []string) error {
		api.AddAgentArgs(cmd, &query, &debug)
		return api.SendToAgent("/stream/agent/add-series", query, debug)
	},
}

func init() {
	api.AddAgentArgs(addSeriesCmd, &query, &debug)
	rootCmd.AddCommand(addSeriesCmd)
}
