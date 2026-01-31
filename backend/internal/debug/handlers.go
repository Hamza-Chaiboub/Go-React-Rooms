package debug

import (
	"context"
	"database/sql"
	"go-react-rooms/internal/functions"
	"net/http"
	"time"
)

func DBTime(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		var now time.Time
		if err := db.QueryRowContext(ctx, "select now()").Scan(&now); err != nil {
			functions.WriteJSON(w, http.StatusInternalServerError, map[string]any{
				"error": err.Error(),
			})
		}
		functions.WriteJSON(w, http.StatusOK, map[string]any{
			"db_time": now.UTC().Format(time.RFC3339),
		})
	}
}
