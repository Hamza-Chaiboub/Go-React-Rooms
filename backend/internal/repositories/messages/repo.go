package messages

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Message struct {
	ID        string    `json:"id"`
	RoomID    string    `json:"roomId"`
	SenderID  string    `json:"senderId"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
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
