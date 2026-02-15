package handlers

import (
	"fmt"

	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/types"
)

func GetSeries() error {
	series, err := api.MakeAPIRequest[[]types.Series]("/api/sonarr/get-series")
	if err != nil {
		return nil
	}

	for _, s := range series {
		fmt.Println(s.Title)
	}

	return nil
}
