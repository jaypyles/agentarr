package agentarr

import (
	"fmt"
	"net/url"

	"github.com/jaypyles/cockpit/cli/api"
	"github.com/jaypyles/cockpit/cli/types"
	"github.com/spf13/cobra"
)

var movieQuery string
var movieDebug bool

var addMovieCmd = cobra.Command{
	Use: "add-movie",
	Short: "Add Movie",
	RunE: func(cmd *cobra.Command, args []string) error {
		q := url.Values{}
		q.Set("query", movieQuery)
		q.Set("debug", fmt.Sprintf("%v", movieDebug))


		resp, err := api.MakeStreamingRequest("/stream/agent/add-movie", q)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		return api.ParseAgentStreamJSON(resp.Body, func(event types.AgentStreamEvent) error {
			fmt.Printf("[%s] %s\n", event.Status, event.Message)
			return nil
		})
	},
}


func init() {
	addMovieCmd.Flags().StringVar(&movieQuery, "query", "", "Query to send to the Agent")
	addMovieCmd.Flags().BoolVar(&movieDebug, "debug", false, "Use debug mode")
	addMovieCmd.MarkFlagRequired("query")
	rootCmd.AddCommand(&addMovieCmd)
}