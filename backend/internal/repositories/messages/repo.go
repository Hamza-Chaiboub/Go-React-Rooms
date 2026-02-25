package messages

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Message struct {
	ID         string    `json:"id"`
	RoomID     string    `json:"roomId"`
	SenderID   string    `json:"senderId"`
	SenderName string    `json:"senderName"`
	Body       string    `json:"body"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Cursor struct {
	BeforeID string // message id
}

type Repo struct {
	DB *sql.DB
}

func (repo Repo) Insert(ctx context.Context, roomID, senderID, body string) (Message, error) {
	body = strings.TrimSpace(body)
	if body == "" {
		return Message{}, errors.New("body required")
	}

	var message Message
	err := repo.DB.QueryRowContext(ctx, `
		INSERT INTO messages (room_id, sender_id, body)
		VALUES ($1::uuid, $2::uuid, $3)
		RETURNING id::text, room_id::text, sender_id::text, body, created_at
		`, roomID, senderID, body).Scan(&message.ID, &message.RoomID, &message.SenderID, &message.Body, &message.CreatedAt)

	return message, err
}

// ListLatest returns newest-first messages, if beforeID is provided it returns messages older than that message
// Ordering is by (created_at DESC, id DESC) to break ties
func (repo Repo) ListLatest(ctx context.Context, roomID string, beforeID string, limit int) ([]Message, error) {
	if limit <= 0 || limit > 200 {
		limit = 50
	}

	//	if no cursor, just take latest
	if strings.TrimSpace(beforeID) == "" {
		return repo.listLatestNoCursor(ctx, roomID, limit)
	}

	//	with cursor: find (created_at, id) or beforeID, then fetch older than that tuple
	rows, err := repo.DB.QueryContext(ctx, `
		WITH cursor AS (
		    SELECT created_at, id
		    FROM messages
		    WHERE id = $2::uuid AND room_id = $1::uuid
		)
		SELECT m.id::text, m.room_id::text, m.sender_id::text, m.body, m.created_at, u.name
		FROM messages m
		JOIN users u ON u.id = m.sender_id, cursor c
		WHERE m.room_id = $1::uuid
			AND (m.created_at < c.created_at OR (m.created_at = c.created_at AND m.id < c.id))
		ORDER BY m.created_at DESC, m.id DESC
		LIMIT $3
	`, roomID, beforeID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var receivedRows []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(&message.ID, &message.RoomID, &message.SenderID, &message.Body, &message.CreatedAt, &message.SenderName); err != nil {
			return nil, err
		}
		receivedRows = append(receivedRows, message)
	}
	return receivedRows, rows.Err()
}

func (repo Repo) listLatestNoCursor(ctx context.Context, roomID string, limit int) ([]Message, error) {
	rows, err := repo.DB.QueryContext(ctx, `
		SELECT m.id::text, m.room_id::text, m.sender_id::text, m.body, m.created_at, u.name
		FROM messages m
		JOIN users u ON u.id = m.sender_id
		WHERE room_id = $1::uuid
		ORDER BY created_at DESC, id DESC
		LIMIT $2
	`, roomID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var receivedRows []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(&message.ID, &message.RoomID, &message.SenderID, &message.Body, &message.CreatedAt, &message.SenderName); err != nil {
			return nil, err
		}
		receivedRows = append(receivedRows, message)
	}
	return receivedRows, rows.Err()
}
