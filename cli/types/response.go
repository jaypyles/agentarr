package types

type Series struct {
	Title string `json:"title"`
}

type Movie struct {
	Title string `json:"title"`
}

// AgentStreamEvent is the payload shape emitted by the API agent SSE endpoints.
type AgentStreamEvent struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Raw     any    `json:"raw,omitempty"`
}