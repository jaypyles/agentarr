package api

import (
	"fmt"
	"time"

	"github.com/jaypyles/agentarr/cli/types"
)

func FormatBytes(bytes int64) string {
	if bytes < 1024 {
		return fmt.Sprintf("%d B", bytes)
	}
	if bytes < 1024*1024 {
		return fmt.Sprintf("%.1f KiB", float64(bytes)/1024)
	}
	if bytes < 1024*1024*1024 {
		return fmt.Sprintf("%.1f MiB", float64(bytes)/(1024*1024))
	}
	return fmt.Sprintf("%.1f GiB", float64(bytes)/(1024*1024*1024))
}

func FormatETA(seconds int64) string {
	if seconds < 0 {
		return "unknown"
	}
	return (time.Duration(seconds) * time.Second).Round(time.Second).String()
}

func Truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	if max <= 3 {
		return s[:max]
	}
	return s[:max-3] + "..."
}

func FormatTorrentToReadable(torrent types.Torrent) string {
	return fmt.Sprintf(
		"%-40s | %6.2f%% | %-12s | DL %8s/s | UL %8s/s | ETA %s\n",
		Truncate(torrent.Name, 40),
		torrent.Progress*100,
		torrent.State,
		FormatBytes(torrent.DLSpeed),
		FormatBytes(torrent.UpSpeed),
		FormatETA(torrent.ETA),
	)

}
