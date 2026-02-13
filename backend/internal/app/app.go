package app

import (
	"errors"
	"go-react-rooms/internal/auth"
	"go-react-rooms/internal/auth/routes"
	"go-react-rooms/internal/cache"
	"go-react-rooms/internal/chat"
	"go-react-rooms/internal/config"
	"go-react-rooms/internal/db"
	"go-react-rooms/internal/debug"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/health"
	"go-react-rooms/internal/httpserver"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/messages"
	"go-react-rooms/internal/repositories/rooms"
	"go-react-rooms/internal/repositories/users"
	"go-react-rooms/internal/security"
	"go-react-rooms/internal/ws"
	"net/http"
	"time"
)

type App struct {
	Config  config.Config
	DB      *db.Postgres
	Redis   *cache.Redis
	Handler http.Handler
}

func New(cfg config.Config) (*App, error) {
	if cfg.DatabaseURL == "" {
		return nil, errors.New("DATABASE_URL missing")
	}
	if cfg.RedisURL == "" {
		return nil, errors.New("REDIS_URL missing")
	}

	pg, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	rd, err := cache.Connect(cfg.RedisURL)
	if err != nil {
		return nil, err
	}

	mux := http.NewServeMux()

	csrfH := security.CSRFHandlers{
		Opt: security.CSRFCookieOptions(cfg.AppEnv),
	}
	rateLimiter := security.NewRateLimiter(rd.Client)
	//Issue CSRF cookie/token
	mux.HandleFunc("/auth/csrf", csrfH.Issue)

	mux.HandleFunc("/health/live", health.Live)
	mux.HandleFunc("/health/ready", health.Ready(health.Deps{
		DB:    pg.DB,
		Redis: rd.Client,
	}))
	mux.HandleFunc("/debug/dbtime", debug.DBTime(pg.DB))
	userRepo := users.Repo{
		DB: pg.DB,
	}
	sessionStore := auth.NewSessionStore(rd.Client)
	authHandler := auth.Handlers{
		Users:    userRepo,
		Sessions: sessionStore,
	}
	//Register
	var registerHandler http.Handler
	registerHandler = http.HandlerFunc(authHandler.Register)
	registerHandler = security.CSRFMiddleware(registerHandler)
	registerHandler = security.RateLimitMiddleware(rateLimiter, "register", 5, 10*time.Minute, registerHandler)
	registerHandler = security.BodyLimit(1<<20, registerHandler)
	mux.Handle("/auth/register", registerHandler)
	//Login
	var loginHandler http.Handler
	loginHandler = http.HandlerFunc(authHandler.Login)
	loginHandler = security.CSRFMiddleware(loginHandler)
	loginHandler = security.RateLimitMiddleware(rateLimiter, "login", 10, 5*time.Minute, loginHandler)
	loginHandler = security.BodyLimit(1<<20, loginHandler)
	mux.Handle("/auth/login", loginHandler)
	//Logout
	var logoutHandler http.Handler
	logoutHandler = http.HandlerFunc(authHandler.Logout)
	logoutHandler = security.CSRFMiddleware(logoutHandler)
	mux.Handle("/auth/logout", logoutHandler)

	meHandler := routes.Me(userRepo)
	mux.Handle("/me", middleware.RequireAuth(sessionStore, meHandler))

	// create/list room(s)
	messagesRepo := messages.Repo{
		DB: pg.DB,
	}
	roomRepo := rooms.Repo{
		DB: pg.DB,
	}
	roomHandler := chat.Handlers{
		Rooms: roomRepo,
	}
	roomsHandler := middleware.RequireAuth(sessionStore, http.HandlerFunc(roomHandler.HandleRooms))
	mux.Handle("/rooms", roomsHandler)

	// add member to room
	var addToRoomHandler http.Handler
	addToRoomHandler = http.HandlerFunc(roomHandler.JoinRoom)
	addToRoomHandler = middleware.RequireAuth(sessionStore, addToRoomHandler)
	mux.Handle("/room/join", addToRoomHandler)

	// websockets
	hub := ws.NewHub()
	go hub.Run()
	wsHandler := ws.NewHandler(hub, sessionStore, roomRepo, messagesRepo)
	mux.Handle("/ws", wsHandler)

	var handler http.Handler = mux
	//handler := httpserver.NewHandler(httpserver.CORSConfig{
	//	Origins: cfg.CorsOrigin,
	//}, mux)
	handler = security.SecurityHeaders(handler)
	handler = httpserver.NewHandler(httpserver.CORSConfig{
		Origins: cfg.CorsOrigin,
	}, handler)
	handler = withRecover(handler)

	return &App{
		Config:  cfg,
		DB:      pg,
		Redis:   rd,
		Handler: handler,
	}, nil
}

func (a *App) Server() *http.Server {
	return &http.Server{
		Addr:              ":" + a.Config.Port,
		Handler:           a.Handler,
		ReadHeaderTimeout: 5 * time.Second,
	}
}

func (a *App) Close() {
	if a.Redis != nil {
		_ = a.Redis.Client.Close()
	}
	if a.DB != nil {
		_ = a.DB.DB.Close()
	}
}

func withRecover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				functions.WriteError(w, http.StatusInternalServerError, "server error")
				return
			}
		}()
		next.ServeHTTP(w, r)
	})
}
