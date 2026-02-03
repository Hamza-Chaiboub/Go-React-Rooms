package auth

import "net/http"

const CookieName = "grr_session" // I couldn't come up with a good name, sooooo ...

type CookieOptions struct {
	Secure   bool
	SameSite http.SameSite
}

func SetSessionCookie(w http.ResponseWriter, sessionID string, opt CookieOptions) {
	http.SetCookie(w, &http.Cookie{
		Name:     CookieName,
		Value:    sessionID,
		Path:     "/",
		HttpOnly: true,
		Secure:   opt.Secure,
		SameSite: opt.SameSite,
		MaxAge:   60 * 60 * 24 * 7,
	})
}

func ClearSessionCookie(w http.ResponseWriter, opt CookieOptions) {
	http.SetCookie(w, &http.Cookie{
		Name:     CookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   opt.Secure,
		SameSite: opt.SameSite,
		MaxAge:   -1,
	})
}
