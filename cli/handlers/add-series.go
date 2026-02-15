package handlers

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func AddSeries(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/add-series", query, debug)
}

func AddSeriesStream(query string, debug bool) (<-chan types.AgentStreamEvent, <-chan error) {
	return api.StreamToAgent("/stream/agent/add-series", query, debug)
}