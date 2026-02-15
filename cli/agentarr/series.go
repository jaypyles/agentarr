package agentarr

import (
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var seriesCmd = cobra.Command{
	Use:   "series",
	Short: "Get Series",
	RunE: func(cmd *cobra.Command, args []string) error {
		return handlers.GetSeries()

	},
}

func init() {
	rootCmd.AddCommand(&seriesCmd)
}
