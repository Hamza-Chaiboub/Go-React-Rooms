package health

import (
	"context"
	"database/sql"
	"go-react-rooms/internal/functions"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

type Deps struct {
	DB    *sql.DB
	Redis *redis.Client
}

func Live(w http.ResponseWriter, r *http.Request) {
	functions.WriteJSON(w, http.StatusOK, map[string]any{
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

		functions.WriteJSON(w, code, map[string]any{
			"status": status,
			"db":     dbOk,
			"redis":  redisOk,
		})
	}
}
