package handlers

import "github.com/jaypyles/agentarr/cli/api"

func MoveFiles(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/move-files", query, debug)
}
