package agentarr

import (
	"github.com/jaypyles/cockpit/cli/api"
	"github.com/spf13/cobra"
)

var moveFilesQuery string
var moveFilesDebug bool

var moveFilesCmd = &cobra.Command{
	Use:   "move-files",
	Short: "Move Files",
	RunE: func(cmd *cobra.Command, args []string) error {
		return api.SendToAgent("/stream/agent/move-files", moveFilesQuery, moveFilesDebug)
	},
}

func init() {
	api.AddAgentArgs(moveFilesCmd, &moveFilesQuery, &moveFilesDebug)
	rootCmd.AddCommand(moveFilesCmd)
}
