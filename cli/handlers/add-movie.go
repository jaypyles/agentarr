package handlers

import (
	"github.com/jaypyles/agentarr/cli/api"
)


func AddMovie(query string, debug bool) error {
	return api.SendToAgent("/stream/agent/add-movie", query, debug)
}