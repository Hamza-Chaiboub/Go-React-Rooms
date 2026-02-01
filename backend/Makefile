include ../.env
export

DB_URL ?= postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres:$(POSTGRES_PORT)/$(POSTGRES_DB)?sslmode=disable

migrate-up:
	docker compose --env-file ../.env run --rm migrate -path=/migrations -database "$(DB_URL)" up

migrate-down:
	docker compose --env-file ../.env run --rm migrate -path=/migrations -database "$(DB_URL)" down 1