package handlers

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func GetMovies() []types.Movie {
	movies, err := api.MakeAPIRequest[[]types.Movie]("/api/radarr/get-movies", "")
	if err != nil {
		return nil
	}

	for _, m := range movies {
		fmt.Println(m.Title)
	}

	return movies
}
