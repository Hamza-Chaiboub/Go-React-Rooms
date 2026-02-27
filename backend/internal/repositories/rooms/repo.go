package rooms

import (
	"context"
	"database/sql"
	"errors"
	"go-react-rooms/internal/repositories/messages"
	"strings"
	"time"

	"github.com/lib/pq"
)

type Room struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	CreatedBy   string            `json:"createdBy"`
	CreatedAt   time.Time         `json:"createdAt"`
	LastMessage *messages.Message `json:"lastMessage,omitempty"`
}

type Repo struct {
	DB *sql.DB
}

var ErrRoomNameExists = errors.New("room name already existes")

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

	if err != nil {
		var pgErr *pq.Error
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return Room{}, ErrRoomNameExists
		}
		return Room{}, err
	}

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
		    WHERE room_id = $1::uuid AND user_id = $2::uuid
		)`, roomID, userID).Scan(&exists)
	return exists, err
}

func (repo Repo) ListForUser(ctx context.Context, userID string) ([]Room, error) {
	rows, err := repo.DB.QueryContext(ctx, `
		SELECT
		    r.id::text,
			r.name,
		    r.created_by::text,
			r.created_at,
		    msg.body as last_message_body,
		    msg.sender_id::text as last_message_sender_id,
			msg.created_at as last_message_created_at,
		    u.name as last_message_sender_name
		FROM rooms r
		JOIN room_members m ON m.room_id = r.id
		LEFT JOIN LATERAL ( 
		    SELECT body, sender_id, created_at
		    FROM messages
		    WHERE room_id = r.id
		    ORDER BY created_at DESC
		    LIMIT 1
		 ) msg ON true
		LEFT JOIN users u ON u.id = msg.sender_id
		WHERE m.user_id = $1::uuid
		ORDER BY COALESCE(msg.created_at, r.created_at) DESC, r.id DESC
		`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Room
	for rows.Next() {
		var rm Room
		var lastMessageBody, lastMessageSenderID, lastMessageSenderName *string
		var lastMessageCreatedAt *time.Time
		if err := rows.Scan(
			&rm.ID,
			&rm.Name,
			&rm.CreatedBy,
			&rm.CreatedAt,
			&lastMessageBody,
			&lastMessageSenderID,
			&lastMessageCreatedAt,
			&lastMessageSenderName,
		); err != nil {
			return nil, err
		}

		if lastMessageBody != nil {
			rm.LastMessage = &messages.Message{
				Body:       *lastMessageBody,
				SenderID:   *lastMessageSenderID,
				SenderName: *lastMessageSenderName,
				CreatedAt:  *lastMessageCreatedAt,
				RoomID:     rm.ID,
			}
		}

		out = append(out, rm)
	}
	return out, rows.Err()
}
