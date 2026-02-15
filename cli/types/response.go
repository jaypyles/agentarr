package types

type Series struct {
	Title string `json:"title"`
}

type Movie struct {
	Title string `json:"title"`
}

type AgentStreamEvent struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Raw     any    `json:"raw,omitempty"`
}

type Torrent struct {
	AddedOn           int64   `json:"added_on"`
	AmountLeft        int64   `json:"amount_left"`
	AutoTMM           bool    `json:"auto_tmm"`
	Category          string  `json:"category"`
	Completed         int64   `json:"completed"`
	CompletionOn      int64   `json:"completion_on"`
	DLLimit           int64   `json:"dl_limit"`
	DLSpeed           int64   `json:"dlspeed"`
	Downloaded        int64   `json:"downloaded"`
	DownloadedSession int64   `json:"downloaded_session"`
	ETA               int64   `json:"eta"`
	FLPiecePrio       bool    `json:"f_l_piece_prio"`
	ForceStart        bool    `json:"force_start"`
	Hash              string  `json:"hash"`
	LastActivity      int64   `json:"last_activity"`
	MagnetURI         string  `json:"magnet_uri"`
	MaxRatio          float64 `json:"max_ratio"`
	MaxSeedingTime    int64   `json:"max_seeding_time"`
	Name              string  `json:"name"`
	NumComplete       int64   `json:"num_complete"`
	NumIncomplete     int64   `json:"num_incomplete"`
	NumLeechs         int64   `json:"num_leechs"`
	NumSeeds          int64   `json:"num_seeds"`
	Priority          int64   `json:"priority"`
	Progress          float64 `json:"progress"`
	Ratio             float64 `json:"ratio"`
	RatioLimit        float64 `json:"ratio_limit"`
	SavePath          string  `json:"save_path"`
	SeedingTimeLimit  int64   `json:"seeding_time_limit"`
	SeenComplete      int64   `json:"seen_complete"`
	SeqDL             bool    `json:"seq_dl"`
	Size              int64   `json:"size"`
	State             string  `json:"state"`
	SuperSeeding      bool    `json:"super_seeding"`
	Tags              string  `json:"tags"`
	TimeActive        int64   `json:"time_active"`
	TotalSize         int64   `json:"total_size"`
	Tracker           string  `json:"tracker"`
	UpLimit           int64   `json:"up_limit"`
	Uploaded          int64   `json:"uploaded"`
	UploadedSession   int64   `json:"uploaded_session"`
	UpSpeed           int64   `json:"upspeed"`
}