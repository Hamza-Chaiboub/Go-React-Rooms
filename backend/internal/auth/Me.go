package auth

import (
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/repositories/users"
	"net/http"
)

func Me(sessionStore *SessionStore, usersRepo users.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessionID := r.Header.Get("X-Session-Token")
		if sessionID == "" {
			functions.WriteError(w, http.StatusUnauthorized, "missing session token")
			return
		}
		sid, _ := sessionStore.Get(r.Context(), sessionID)
		u, err := usersRepo.GetUserById(r.Context(), sid)
		if err != nil {
			functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		functions.WriteJSON(w, http.StatusOK, map[string]any{
			"id":    u.ID,
			"email": u.Email,
		})
	}
}
