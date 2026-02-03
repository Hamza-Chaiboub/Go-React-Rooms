package auth

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/repositories/users"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type registerReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Handlers struct {
	Users    users.Repo
	Sessions *SessionStore
	Cookie   CookieOptions
}

func (h Handlers) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}
	if contentType := r.Header.Get("Content-Type"); contentType != "" && !strings.Contains(contentType, "application/json") {
		functions.WriteError(w, http.StatusUnsupportedMediaType, "Content-Type must be application/json")
		return
	}
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

func (h Handlers) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}
	if contentType := r.Header.Get("Content-Type"); contentType != "" && !strings.Contains(contentType, "application/json") {
		functions.WriteError(w, http.StatusUnsupportedMediaType, "Content-Type must be application/json")
		return
	}
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid json")
		return
	}

	u, err := h.Users.FindByEmail(r.Context(), req.Email)
	if err != nil {
		functions.WriteError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		functions.WriteError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	sid, err := h.Sessions.NewSessionID()
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could not create session")
		return
	}

	if err := h.Sessions.Save(r.Context(), sid, u.ID); err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could  not save session")
		return
	}

	SetSessionCookie(w, sid, h.Cookie)

	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"id":    u.ID,
		"email": u.Email,
	})
}

func (h Handlers) Logout(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie(CookieName)
	if err == nil && c.Value != "" {
		_ = h.Sessions.Delete(r.Context(), c.Value)
	}

	ClearSessionCookie(w, h.Cookie)
	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"status": "ok",
	})
}
