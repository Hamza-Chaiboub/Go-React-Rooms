package chat

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/rooms"
	"net/http"
)

type Handlers struct {
	Rooms rooms.Repo
}

type createRoomReq struct {
	Name string `json:"name"`
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
