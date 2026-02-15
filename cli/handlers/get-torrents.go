package handlers

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func GetTorrents() ([]types.Torrent, []string) {
	torrents, err := api.MakeAPIRequest[[]types.Torrent]("/api/download/list", "")

	if err != nil {
		return nil, nil
	}

	formatted := make([]string, 0, len(torrents))

	for _, t := range torrents {
		line := api.FormatTorrentToReadable(t)
		formatted = append(formatted, line)
		fmt.Print(line)
	}

	return torrents, formatted
}
