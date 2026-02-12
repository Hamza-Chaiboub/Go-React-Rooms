package chat

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/rooms"
	"net/http"
	"strings"
)

type Handlers struct {
	Rooms rooms.Repo
}

type createRoomReq struct {
	Name string `json:"name"`
}

type joinRoomReq struct {
	RoomID string `json:"roomId"`
}

func (handler Handlers) CreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req createRoomReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid json")
		return
	}

	room, err := handler.Rooms.Create(r.Context(), req.Name, userID)
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "could not create room")
		return
	}

	//	room creator joins automatically
	_ = handler.Rooms.AddMember(r.Context(), room.ID, userID)

	functions.WriteJSON(w, http.StatusCreated, room)
}

func (handler Handlers) ListRooms(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	items, err := handler.Rooms.ListForUser(r.Context(), userID)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could not list rooms")
		return
	}

	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"rooms": items,
	})
}

func (handler Handlers) JoinRoom(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req joinRoomReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid json")
		return
	}
	req.RoomID = strings.TrimSpace(req.RoomID)
	if req.RoomID == "" {
		functions.WriteError(w, http.StatusBadRequest, "roomId required")
		return
	}

	//	add member
	if err := handler.Rooms.AddMember(r.Context(), req.RoomID, userID); err != nil {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	functions.WriteJSON(w, http.StatusOK, map[string]any{"status": "ok"})
}

func (handler Handlers) HandleRooms(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		handler.ListRooms(w, r)
	case http.MethodPost:
		handler.CreateRoom(w, r)
	default:
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
