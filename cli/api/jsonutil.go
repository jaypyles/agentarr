package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/tmaxmax/go-sse"
)

var apiUrl = "https://agentarr.jaydenpyles.dev"
var streamingHTTPClient = &http.Client{
	Transport: &http.Transport{
		Proxy:              http.ProxyFromEnvironment,
		DisableCompression: true,
	},
}

func DecodeJSONFromReader[T any](r io.Reader) (T, error) {
	var result T
	err := json.NewDecoder(r).Decode(&result)
	return result, err
}

func MakeAPIRequest[T any](endpoint string) (T, error) {
	var result T

	req, err := http.NewRequest("GET", apiUrl+endpoint, nil)
	if err != nil {
		return result, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return result, err
	}
	defer resp.Body.Close()


	result, err = DecodeJSONFromReader[T](resp.Body)

	if err != nil {
		return result, err
	}

	return result, nil
}

func MakeStreamingRequest(endpoint string, queryParams url.Values) (*http.Response, error) {
	req, err := http.NewRequest("GET", apiUrl+endpoint, nil)
	if err != nil {
		return nil, err
	}
	if queryParams != nil {
		req.URL.RawQuery = queryParams.Encode()
	}
	req.Header.Set("Accept", "text/event-stream")
	req.Header.Set("Accept-Encoding", "identity")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; AgentarrCLI/1.0)")

	resp, err := streamingHTTPClient.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		defer resp.Body.Close()
		return nil, fmt.Errorf("unexpected streaming status: %s", resp.Status)
	}

	contentType := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "text/event-stream") {
		defer resp.Body.Close()
		return nil, fmt.Errorf("unexpected streaming content-type: %q", contentType)
	}

	return resp, nil
}

// ParseAgentStream reads an SSE response body and calls onData for each non-empty
// data event payload.
func ParseAgentStream(r io.Reader, onData func(string) error) error {
	for ev, err := range sse.Read(r, nil) {
		if err != nil {
			return err
		}
		if len(ev.Data) == 0 {
			continue
		}
		if err := onData(ev.Data); err != nil {
			return err
		}
	}
	return nil
}

// ParseAgentStreamJSON reads SSE events and unmarshals each data payload into T.
func ParseAgentStreamJSON[T any](r io.Reader, onEvent func(T) error) error {
	return ParseAgentStream(r, func(data string) error {
		var event T
		if err := json.Unmarshal([]byte(data), &event); err != nil {
			return err
		}
		return onEvent(event)
	})
}
