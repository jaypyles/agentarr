package handlers

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func AddMovie(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/add-movie", query, debug)
}

func AddMovieStream(query string, debug bool) (<-chan types.AgentStreamEvent, <-chan error) {
	return api.StreamToAgent("/stream/agent/add-movie", query, debug)
}
