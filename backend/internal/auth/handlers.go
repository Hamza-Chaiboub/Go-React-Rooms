package auth

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/repositories/users"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type registerReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Handlers struct {
	Users users.Repo
}

func (h Handlers) Register(w http.ResponseWriter, r *http.Request) {
	var req registerReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid json")
		return
	}
	if len(req.Password) < 10 {
		functions.WriteError(w, http.StatusBadRequest, "password must be at least 10 chars")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could not hash password")
		return
	}

	u, err := h.Users.Create(r.Context(), req.Email, string(hash))
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "could not create user")
		return
	}

	functions.WriteJSON(w, http.StatusCreated, map[string]any{
		"id":    u.ID,
		"email": u.Email,
	})
}
