package app

import (
	"errors"
	"go-react-rooms/internal/auth"
	"go-react-rooms/internal/cache"
	"go-react-rooms/internal/config"
	"go-react-rooms/internal/db"
	"go-react-rooms/internal/debug"
	"go-react-rooms/internal/health"
	"go-react-rooms/internal/httpserver"
	"go-react-rooms/internal/repositories/users"
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
	mux.HandleFunc("/auth/register", authHandler.Register)
	mux.HandleFunc("/auth/login", authHandler.Login)
	mux.HandleFunc("/auth/logout", authHandler.Logout)
	mux.HandleFunc("/me", auth.Me(sessionStore, userRepo))

	handler := httpserver.NewHandler(httpserver.CORSConfig{
		Origins: cfg.CorsOrigin,
	}, mux)

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
