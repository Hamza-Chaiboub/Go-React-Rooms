package chat

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/messages"
	"go-react-rooms/internal/repositories/rooms"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Handlers struct {
	Rooms    rooms.Repo
	Messages messages.Repo
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

func (handler Handlers) ListMessages(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	roomID := strings.TrimSpace(r.URL.Query().Get("roomId"))
	if roomID == "" {
		functions.WriteError(w, http.StatusBadRequest, "roomId is required")
		return
	}

	//	membership check
	isMember, err := handler.Rooms.IsMember(r.Context(), roomID, userID)
	if err != nil || !isMember {
		functions.WriteError(w, http.StatusForbidden, "forbidden")
		return
	}

	before := strings.TrimSpace(r.URL.Query().Get("before"))

	limit := 50
	if requestLimit := strings.TrimSpace(r.URL.Query().Get("limit")); requestLimit != "" {
		if requestLimitToint, err := strconv.Atoi(requestLimit); err == nil {
			limit = requestLimitToint
		}
	}

	messages, err := handler.Messages.ListLatest(r.Context(), roomID, before, limit)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}

	//	provide a next cursor for pagination (oldest item in this page)
	var nextCursor string
	if len(messages) > 0 {
		nextCursor = messages[len(messages)-1].ID
	}

	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"messages":   messages,
		"nextBefore": nextCursor,
		"serverTime": time.Now().UTC().Format(time.RFC3339),
	})
}
