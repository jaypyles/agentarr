package handlers

import "github.com/jaypyles/agentarr/cli/api"

func AddSeries(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/add-series", query, debug)
}