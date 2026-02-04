package routes

import (
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/users"
	"net/http"
)

func Me(usersRepo users.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := middleware.UserIDFromContext(r.Context())
		if !ok {
			functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}
		u, err := usersRepo.GetUserById(r.Context(), userID)
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
