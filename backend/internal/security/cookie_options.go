package security

import (
	"go-react-rooms/internal/auth"
	"net/http"
	"strings"
)

type CSRFOptions struct {
	Secure   bool
	SameSite http.SameSite
}

func SessionCookieOptions(appEnv string) auth.CookieOptions {
	secure := !isDev(appEnv)

	return auth.CookieOptions{
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
	}
}

func CSRFCookieOptions(appEnv string) CSRFOptions {
	secure := !isDev(appEnv)

	return CSRFOptions{
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
	}
}

func isDev(env string) bool {
	v := strings.ToLower(strings.TrimSpace(env))
	return v == "" || v == "dev" || v == "development" || v == "local"
}
