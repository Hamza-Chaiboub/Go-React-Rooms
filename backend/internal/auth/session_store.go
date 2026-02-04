package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionStore struct {
	Redis     *redis.Client
	TTL       time.Duration
	KeyPrefix string
}

func NewSessionStore(rdb *redis.Client) *SessionStore {
	return &SessionStore{
		Redis:     rdb,
		TTL:       7 * 24 * time.Hour,
		KeyPrefix: "session:",
	}
}

func (s *SessionStore) NewSessionID() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (s *SessionStore) Save(ctx context.Context, sessionID string, userID string) error {
	if sessionID == "" || userID == "" {
		return errors.New("sessionID and userID required")
	}

	key := s.KeyPrefix + sessionID
	return s.Redis.Set(ctx, key, userID, s.TTL).Err()
}

func (s *SessionStore) Delete(ctx context.Context, sessionID string) error {
	key := s.KeyPrefix + sessionID
	return s.Redis.Del(ctx, key).Err()
}

func (s *SessionStore) Get(ctx context.Context, sessionID string) (string, error) {
	key := s.KeyPrefix + sessionID
	userID, err := s.Redis.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", errors.New("session not found")
	}
	return userID, err
}
