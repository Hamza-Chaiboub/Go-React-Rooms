package app

import (
	"errors"
	"go-react-rooms/internal/config"
	"go-react-rooms/internal/db"
	"go-react-rooms/internal/debug"
	"go-react-rooms/internal/httpserver"
	"net/http"
	"time"
)

type App struct {
	Config  config.Config
	DB      *db.Postgres
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

	mux := http.NewServeMux()

	//mux.HandleFunc("/health/live", nil)
	//mux.HandleFunc("/health/ready", nil)
	mux.HandleFunc("/debug/dbtime", debug.DBTime(pg.DB))

	handler := httpserver.NewHandler(httpserver.CORSConfig{
		Origins: cfg.CorsOrigin,
	}, mux)

	return &App{
		Config:  cfg,
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
