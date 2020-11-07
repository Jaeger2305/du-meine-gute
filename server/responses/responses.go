package responses

// HTTPBasic a basic error object with some contextual information to be handled sensibly by the client side.
type HTTPBasic struct {
	Status      int         `json:status`
	Description string      `json:description`
	IsError     bool        `json:isError`
	Body        interface{} `json:body`
}
