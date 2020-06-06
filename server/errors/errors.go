package errors

// HTTPError a basic error object with some contextual information to be handled sensibly by the client side.
type HTTPError struct {
	Status      int    `json:status`
	Description string `json:description`
	IsError     bool
}
