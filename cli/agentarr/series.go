package agentarr

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
	"github.com/spf13/cobra"
)

var seriesCmd = cobra.Command{
	Use: "series",
	Short: "Get Series",
	RunE: func(cmd *cobra.Command, args []string) error {
		series, err := api.MakeAPIRequest[[]types.Series]("/api/sonarr/get-series")
		if err != nil {
			return nil
		}

		for _, s := range series {
			fmt.Println(s.Title)
		}

		return nil
	},
}

func init() {
	rootCmd.AddCommand(&seriesCmd)
}