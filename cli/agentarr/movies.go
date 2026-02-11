package agentarr

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
	"github.com/spf13/cobra"
)

var movieCmd = cobra.Command{
	Use: "movies",
	Short: "Get Movies",
	RunE: func(cmd *cobra.Command, args []string) error {
		series, err := api.MakeAPIRequest[[]types.Movie]("/api/radarr/get-movies")
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
	rootCmd.AddCommand(&movieCmd)
}