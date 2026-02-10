package security

import (
	"crypto/rand"
	"encoding/hex"
	"go-react-rooms/internal/functions"
	"net/http"
	"strings"
	"time"
)

const CSRFCookieName = "grr_csrf"
const CSRFHeaderName = "X-CSRF-Token"

// set csrf cookie and return token
func MintCSRF(w http.ResponseWriter, token string, opt CSRFOptions) {
	http.SetCookie(w, &http.Cookie{
		Name:     CSRFCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: false,
		Secure:   opt.Secure,
		SameSite: opt.SameSite,
		MaxAge:   int((24 * time.Hour).Seconds()),
	})
}

func NewCSRFToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// mdw to enforce csrf for unsafe methods using double submit cookie pattern
func CSRFMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete:
			//	require header token
			headerToken := strings.TrimSpace(r.Header.Get(CSRFHeaderName))
			if headerToken == "" {
				functions.WriteError(w, http.StatusForbidden, "missing csrf token")
				return
			}

			//	require cookie token
			c, err := r.Cookie(CSRFCookieName)
			if err != nil || c == nil || strings.TrimSpace(c.Value) == "" {
				functions.WriteError(w, http.StatusForbidden, "missing csrf cookie")
				return
			}

			//	must match
			// TODO : I think I will use a Constant Time Compare to prevent leaking info via timing
			if strings.TrimSpace(c.Value) != headerToken {
				functions.WriteError(w, http.StatusForbidden, "invalid csrf token")
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
