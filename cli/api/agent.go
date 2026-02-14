package api

import (
	"fmt"
	"net/url"

	"github.com/jaypyles/agentarr/cli/types"
	"github.com/spf13/cobra"
)

func SendToAgent(endpoint string, query string, debug bool) error {
	q := url.Values{}
	q.Set("query", query)
	q.Set("debug", fmt.Sprintf("%v", debug))

	resp, err := MakeStreamingRequest(endpoint, q)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return ParseAgentStreamJSON(resp.Body, func(event types.AgentStreamEvent) error {
		fmt.Printf("[%s] %s\n", event.Status, event.Message)
		return nil
	})
}

func AddAgentArgs(cmd *cobra.Command, query *string, debug *bool) {
	cmd.Flags().StringVar(query, "query", "", "Query to send to the Agent")
	cmd.Flags().BoolVar(debug, "debug", false, "Use debug mode")
	cmd.MarkFlagRequired("query")
}
