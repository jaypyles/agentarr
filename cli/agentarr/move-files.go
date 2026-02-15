package agentarr

import (
	"github.com/jaypyles/agentarr/cli/api"
	"github.com/jaypyles/agentarr/cli/handlers"
	"github.com/spf13/cobra"
)

var moveFilesQuery string
var moveFilesDebug bool

var moveFilesCmd = &cobra.Command{
	Use:   "move-files",
	Short: "Move Files",
	RunE: func(cmd *cobra.Command, args []string) error {
		return handlers.MoveFiles(moveFilesQuery, moveFilesDebug)
	},
}

func init() {
	api.AddAgentArgs(moveFilesCmd, &moveFilesQuery, &moveFilesDebug)
	rootCmd.AddCommand(moveFilesCmd)
}
