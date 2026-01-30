package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Config struct {
	AppEnv      string
	Port        string
	CorsOrigin  string
	DatabaseURL string
	RedisURL    string
}

func main() {
	config := loadConfig()
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(config)
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}

func loadConfig() Config {
	appEnv := getEnv("APP_ENV", "development")
	port := getEnv("BACKEND_PORT", "8080")
	allCors := getEnv("CORS_ORIGIN", "http://localhost:5173")
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
		CorsOrigin:  allCors,
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
