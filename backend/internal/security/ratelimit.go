package security

import (
	"context"
	"go-react-rooms/internal/functions"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type RateLimiter struct {
	Redis *redis.Client
}

func NewRateLimiter(rdb *redis.Client) *RateLimiter {
	return &RateLimiter{
		Redis: rdb,
	}
}

// Allow increments a key --> is it within a limit (e.g. 10 requests in a 5 minutes window)
func (rl *RateLimiter) Allow(ctx context.Context, key string, limit int, window time.Duration) (bool, error) {
	count, err := rl.Redis.Incr(ctx, key).Result()
	if err != nil {
		return false, err
	}

	//	set ttl on first increment
	if count == 1 {
		if err := rl.Redis.Expire(ctx, key, window).Err(); err != nil {
			return false, err
		}
	}

	return count <= int64(limit), nil
}

// Middleware: per IP & route key
func RateLimitMiddleware(rl *RateLimiter, routeName string, limit int, window time.Duration, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if rl == nil || rl.Redis == nil {
			functions.WriteError(w, http.StatusInternalServerError, "rate limiter not configured")
			return
		}

		ip := clientIP(r)
		key := "rl:" + routeName + ":" + ip

		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		ok, err := rl.Allow(ctx, key, limit, window)
		if err != nil {
			functions.WriteError(w, http.StatusInternalServerError, "rate limit error")
			return
		}
		if !ok {
			functions.WriteError(w, http.StatusTooManyRequests, "too many requests")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func clientIP(r *http.Request) string {
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		parts := strings.Split(xff, ",")
		if len(parts) > 0 {
			return strings.TrimSpace(parts[0])
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil && host != "" {
		return host
	}

	return r.RemoteAddr
}
