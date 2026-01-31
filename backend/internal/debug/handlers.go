package debug

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"
)

func DBTime(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		var now time.Time
		if err := db.QueryRowContext(ctx, "select now()").Scan(&now); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{
				"error": err.Error(),
			})
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"db_time": now.UTC().Format(time.RFC3339),
		})
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
