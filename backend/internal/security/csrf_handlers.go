package security

import (
	"go-react-rooms/internal/functions"
	"net/http"
)

type CSRFHandlers struct {
	Opt CSRFOptions
}

func (h CSRFHandlers) Issue(w http.ResponseWriter, r *http.Request) {
	token, err := NewCSRFToken()
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could not create csrf token")
		return
	}

	MintCSRF(w, token, h.Opt)

	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"csrfToken": token,
	})
}
