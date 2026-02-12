package ws

import "time"

type Envelope struct {
	Type string `json:"type"`
	Room string `json:"room,omitempty"`
	Text string `json:"text,omitempty"`
	From string `json:"from,omitempty"`
	TS   string `json:"ts,omitempty"`
}

type Client struct {
	UserID string
	Send   chan Envelope
	Room   string
}

type broadcastMsg struct {
	room string
	msg  Envelope
}

type Hub struct {
	clients    map[*Client]struct{}
	register   chan *Client
	unregister chan *Client
	broadcast  chan broadcastMsg
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]struct{}),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan broadcastMsg, 64),
	}
}

func (hub *Hub) Run() {
	for {
		select {
		case client := <-hub.register:
			hub.clients[client] = struct{}{}

		case client := <-hub.unregister:
			if _, ok := hub.clients[client]; ok {
				delete(hub.clients, client)
				close(client.Send)
			}

		case broadcast := <-hub.broadcast:
			for client := range hub.clients {
				if client.Room == broadcast.room {
					select {
					case client.Send <- broadcast.msg:
					default:
						delete(hub.clients, client)
						close(client.Send)
					}
				}
			}
		}
	}
}

func (hub *Hub) Broadcast(room string, from string, text string) {
	hub.broadcast <- broadcastMsg{
		room: room,
		msg: Envelope{
			Type: "message",
			Room: room,
			Text: text,
			From: from,
			TS:   time.Now().UTC().Format(time.RFC3339),
		},
	}
}
