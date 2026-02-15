package api

import (
	"fmt"
	"net/url"

	"github.com/jaypyles/agentarr/cli/types"
	"github.com/spf13/cobra"
)

func SendToAgent(endpoint string, query string, debug bool) error {
	return SendToAgentWithHandler(endpoint, query, debug, func(event types.AgentStreamEvent) error {
		fmt.Printf("[%s] %s\n", event.Status, event.Message)
		return nil
	})
}

func SendToAgentWithHandler(endpoint string, query string, debug bool, onEvent func(types.AgentStreamEvent) error) error {
	q := url.Values{}
	q.Set("query", query)
	q.Set("debug", fmt.Sprintf("%v", debug))

	resp, err := MakeStreamingRequest(endpoint, q)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return ParseAgentStreamJSON(resp.Body, onEvent)
}

func StreamToAgent(endpoint string, query string, debug bool) (<-chan types.AgentStreamEvent, <-chan error) {
	events := make(chan types.AgentStreamEvent)
	errs := make(chan error, 1)

	go func() {
		defer close(events)
		defer close(errs)

		err := SendToAgentWithHandler(endpoint, query, debug, func(event types.AgentStreamEvent) error {
			events <- event
			return nil
		})
		if err != nil {
			errs <- err
		}
	}()

	return events, errs
}

func AddAgentArgs(cmd *cobra.Command, query *string, debug *bool) {
	cmd.Flags().StringVar(query, "query", "", "Query to send to the Agent")
	cmd.Flags().BoolVar(debug, "debug", false, "Use debug mode")
	cmd.MarkFlagRequired("query")
}
