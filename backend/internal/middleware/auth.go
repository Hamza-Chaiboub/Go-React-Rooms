package middleware

import (
	"context"
	"go-react-rooms/internal/auth"
	"go-react-rooms/internal/functions"
	"net/http"
)

type ctxKey string

const userIDKey ctxKey = "userID"

func UserIDFromContext(ctx context.Context) (string, bool) {
	v, ok := ctx.Value(userIDKey).(string)
	return v, ok
}

func RequireAuth(sessionStore *auth.SessionStore, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie(auth.CookieName)
		if err != nil || c.Value == "" {
			functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		userID, err := sessionStore.Get(r.Context(), c.Value)
		if err != nil {
			functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
