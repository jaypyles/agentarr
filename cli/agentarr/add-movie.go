package agentarr

import (
	"github.com/jaypyles/cockpit/cli/api"
	"github.com/spf13/cobra"
)

var movieQuery string
var movieDebug bool

var addMovieCmd = cobra.Command{
	Use:   "add-movie",
	Short: "Add Movie",
	RunE: func(cmd *cobra.Command, args []string) error {
		return api.SendToAgent("/stream/agent/add-movie", movieQuery, movieDebug)
	},
}

func init() {
	api.AddAgentArgs(&addMovieCmd, &movieQuery, &movieDebug)
	rootCmd.AddCommand(&addMovieCmd)
}
