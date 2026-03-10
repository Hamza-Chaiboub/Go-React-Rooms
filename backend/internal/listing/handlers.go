package listing

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/listings"
	"net/http"
)

type Handler struct {
	Listings listings.Repo
}

func (handler Handler) CreateListing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}
	UserID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req listings.InsertParams
	req.UserID = UserID
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	listing, err := handler.Listings.Insert(r.Context(), req)
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	functions.WriteJSON(w, http.StatusCreated, listing)
}
