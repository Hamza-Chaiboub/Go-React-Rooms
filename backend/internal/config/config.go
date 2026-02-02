package config

import (
	"log"
	"os"
	"strings"
)

type Config struct {
	AppEnv      string
	Port        string
	CorsOrigin  []string
	DatabaseURL string
	RedisURL    string
}

func LoadConfig() Config {
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
