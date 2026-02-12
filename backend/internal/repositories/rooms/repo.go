package rooms

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Room struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedBy string    `json:"createdBy"`
	CreatedAt time.Time `json:"createdAt"`
}

type Repo struct {
	DB *sql.DB
}

func (repo Repo) Create(ctx context.Context, name string, createdBy string) (Room, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return Room{}, errors.New("name required")
	}

	var room Room
	err := repo.DB.QueryRowContext(ctx, `
		INSERT INTO rooms (name, created_by)
		VALUES ($1, $2::uuid)
		RETURNING id::text, name, created_by::text, created_at
		`, name, createdBy).Scan(&room.ID, &room.Name, &room.CreatedBy, &room.CreatedAt)

	return room, err
}

func (repo Repo) AddMember(ctx context.Context, roomID string, userID string) error {
	_, err := repo.DB.ExecContext(ctx, `
			INSERT INTO room_members (room_id, user_id)
			VALUES ($1::uuid, $2::uuid)
			ON CONFLICT (room_id, user_id) DO NOTHING
			`, roomID, userID)
	return err
}

func (repo Repo) IsMember(ctx context.Context, roomID string, userID string) (bool, error) {
	var exists bool
	err := repo.DB.QueryRowContext(ctx, `
		SELECT EXISTS(
		    SELECT 1 FROM room_members
		    WHERE room_id = $1::uuid AND user = $2::uuid
		)`, roomID, userID).Scan(&exists)
	return exists, err
}

func (repo Repo) ListForUser(ctx context.Context, userID string) ([]Room, error) {
	rows, err := repo.DB.QueryContext(ctx, `
		SELECT r.id::text, r.name, r.created_by::text, r.created_at
		FROM rooms r
		JOIN room_members m ON m.room_id = r.id
		WHERE m.user_id = $1::uuid
		ORDER BY r.created_at DESC, r.id DESC
		`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Room
	for rows.Next() {
		var rm Room
		if err := rows.Scan(&rm.ID, &rm.Name, &rm.CreatedBy, &rm.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, rm)
	}
	return out, rows.Err()
}
