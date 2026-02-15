package handlers

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func GetMovies() error {
	series, err := api.MakeAPIRequest[[]types.Movie]("/api/radarr/get-movies")
	if err != nil {
		return nil
	}

	for _, s := range series {
		fmt.Println(s.Title)
	}

	return nil
}
