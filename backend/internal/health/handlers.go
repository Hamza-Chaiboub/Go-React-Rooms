package health

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

type Deps struct {
	DB    *sql.DB
	Redis *redis.Client
}

func Live(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status": "live",
	})
}

func Ready(deps Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		dbOk := deps.DB != nil && deps.DB.PingContext(ctx) == nil
		redisOk := deps.Redis != nil && deps.Redis.Ping(ctx).Err() == nil

		status := "ready"
		code := http.StatusOK

		if !dbOk || !redisOk {
			status = "not_ready"
			code = http.StatusServiceUnavailable
		}

		writeJSON(w, code, map[string]any{
			"status": status,
			"db":     dbOk,
			"redis":  redisOk,
		})
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
