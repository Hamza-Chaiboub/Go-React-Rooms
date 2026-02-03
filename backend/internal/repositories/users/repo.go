package users

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type User struct {
	ID           string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
}

type Repo struct {
	DB *sql.DB
}

func (r Repo) Create(ctx context.Context, email string, passwordHash string) (User, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return User{}, errors.New("email required")
	}

	var user User
	err := r.DB.QueryRowContext(ctx, `
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		RETURNING id::text, email, password_hash, created_at
		`, email, passwordHash).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)

	return user, err
}

func (r Repo) GetUserById(ctx context.Context, id string) (User, error) {
	var user User
	err := r.DB.QueryRowContext(ctx, `SELECT id::text, email, password_hash, created_at FROM users WHERE id = $1::uuid`, id).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)

	return user, err
}

func (r Repo) FindByEmail(ctx context.Context, email string) (User, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return User{}, errors.New("email required")
	}

	var user User
	err := r.DB.QueryRowContext(ctx, `SELECT id::text, email, password_hash, created_at FROM users WHERE email = $1`, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)

	return user, err
}
