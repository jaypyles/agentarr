package handlers

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func ClearTorrents() error {
	_, err := api.MakeAPIRequest[[]types.Torrent]("/api/download/torrents", "DELETE")

	if err != nil {
		return nil
	}
	return nil
}
