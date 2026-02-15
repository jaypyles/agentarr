package handlers

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func MoveFiles(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/move-files", query, debug)
}

func StreamMoveFiles(query string, debug bool) (<-chan types.AgentStreamEvent, <-chan error) {
	return api.StreamToAgent("/stream/agent/move-files", query, debug)
}
