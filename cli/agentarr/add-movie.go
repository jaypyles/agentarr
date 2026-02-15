package agentarr

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var movieQuery string
var movieDebug bool

var addMovieCmd = cobra.Command{
	Use:   "add-movie",
	Short: "Add Movie",
	RunE: func(cmd *cobra.Command, args []string) error {
		return handlers.AddMovie(movieQuery, movieDebug)
	},
}

func init() {
	api.AddAgentArgs(&addMovieCmd, &movieQuery, &movieDebug)
	rootCmd.AddCommand(&addMovieCmd)
}
