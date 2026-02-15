package agentarr

import (
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var movieCmd = cobra.Command{
	Use:   "movies",
	Short: "Get Movies",
	RunE: func(cmd *cobra.Command, args []string) error {
		handlers.GetMovies()
		return nil
	},
}

func init() {
	rootCmd.AddCommand(&movieCmd)
}
