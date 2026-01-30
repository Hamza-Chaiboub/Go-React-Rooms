package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

type Config struct {
	AppEnv      string
	Port        string
	CorsOrigin  []string
	DatabaseURL string
	RedisURL    string
}

func main() {
	config := loadConfig()
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{
			"status": "ok",
			"env":    config.AppEnv,
			"time":   time.Now().Local().Format(time.RFC3339),
		})
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}

func loadConfig() Config {
	appEnv := getEnv("APP_ENV", "development")
	port := getEnv("BACKEND_PORT", "8080")
	allCors := getEnv("CORS_ORIGIN", "http://localhost:5173")

	parts := strings.Split(allCors, ",")
	var origins []string
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			origins = append(origins, p)
		}
	}

	databaseURL := getEnv("DATABASE_URL", "")
	redisURL := getEnv("REDIS_URL", "")

	if databaseURL == "" {
		log.Fatal("DATABASE_URL not found")
	}
	if redisURL == "" {
		log.Fatal("REDIS_URL not found")
	}

	return Config{
		AppEnv:      appEnv,
		Port:        port,
		CorsOrigin:  origins,
		DatabaseURL: databaseURL,
		RedisURL:    redisURL,
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusInternalServerError)
	}
}
