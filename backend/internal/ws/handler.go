package ws

import (
	"context"
	"encoding/json"
	"go-react-rooms/internal/auth"
	"go-react-rooms/internal/functions"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type Handler struct {
	Upgrader websocket.Upgrader
	Hub      *Hub
	Sessions *auth.SessionStore
}

func NewHandler(hub *Hub, sessions *auth.SessionStore) *Handler {
	return &Handler{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				if origin == "" {
					return true
				}
				return strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "http://127.0.0.1:")
			},
		},
		Hub:      hub,
		Sessions: sessions,
	}
}

func (handler Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//	read session cookie
	cookie, err := r.Cookie(auth.CookieName)
	if err != nil || cookie == nil || cookie.Value == "" {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	sessionID := cookie.Value

	//	resolve session to userID in redis
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	userID, err := handler.Sessions.Get(ctx, sessionID)
	if err != nil || userID == "" {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	//	upgrade to websocket
	conn, err := handler.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := &Client{
		UserID: userID,
		Send:   make(chan Envelope, 16),
		Room:   "main",
	}

	handler.Hub.register <- client

	//	start writer in bg
	go writer(conn, client)

	//	reader loop
	reader(conn, handler.Hub, client)

	//	cleanup
	handler.Hub.unregister <- client
	_ = conn.Close()
}

func reader(conn *websocket.Conn, hub *Hub, client *Client) {
	defer func() {
		_ = conn.Close()
	}()

	conn.SetReadLimit(4096)
	_ = conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	conn.SetPongHandler(func(string) error {
		_ = conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			return
		}

		var envelope Envelope
		if err := json.Unmarshal(data, &envelope); err != nil {
			continue
		}

		switch envelope.Type {
		case "join":
			room := strings.TrimSpace(envelope.Room)
			if room == "" {
				room = "main"
			}
			client.Room = room

		case "message":
			room := strings.TrimSpace(envelope.Room)
			if room == "" {
				room = client.Room
			}
			text := strings.TrimSpace(envelope.Text)
			if text == "" {
				continue
			}
			hub.Broadcast(room, client.UserID, text)
		}
	}
}

func writer(conn *websocket.Conn, client *Client) {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		_ = conn.Close()
	}()

	for {
		select {
		case msg, ok := <-client.Send:
			if !ok {
				_ = conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			_ = conn.WriteJSON(msg)

		case <-ticker.C:
			_ = conn.WriteMessage(websocket.PingMessage, []byte{})
		}
	}
}
