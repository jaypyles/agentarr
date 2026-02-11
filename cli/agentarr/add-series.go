package agentarr

import (
	"fmt"
	"net/url"

	"github.com/jaypyles/cockpit/cli/api"
	"github.com/jaypyles/cockpit/cli/types"
	"github.com/spf13/cobra"
)

var query string
var debug bool

var addSeriesCmd = cobra.Command{
	Use: "add-series",
	Short: "Add Series",
	RunE: func(cmd *cobra.Command, args []string) error {
		q := url.Values{}
		q.Set("query", query)
		q.Set("debug", fmt.Sprintf("%v", debug))


		resp, err := api.MakeStreamingRequest("/stream/agent/add-series", q)
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
	addSeriesCmd.Flags().StringVar(&query, "query", "", "Query to send to the Agent")
	addSeriesCmd.Flags().BoolVar(&debug, "debug", false, "Use debug mode")
	addSeriesCmd.MarkFlagRequired("query")
	rootCmd.AddCommand(&addSeriesCmd)
}