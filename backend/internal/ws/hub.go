package ws

type Envelope struct {
	Type        string `json:"type"`
	Room        string `json:"room,omitempty"`
	Text        string `json:"text,omitempty"`
	ClientMsgID string `json:"clientMsgId,omitempty"`
	MessageID   string `json:"messageId,omitempty"`
	From        string `json:"from,omitempty"`
	TS          string `json:"ts,omitempty"`
	Error       string `json:"error,omitempty"`
	SenderName  string `json:"senderName,omitempty"`
}

type Client struct {
	UserID     string
	Send       chan Envelope
	ActiveRoom string
	Rooms      map[string]struct{}
}

type broadcastMsg struct {
	room string
	msg  Envelope
}

type Hub struct {
	clients    map[*Client]struct{}
	byRoom     map[string]map[*Client]struct{}
	register   chan *Client
	unregister chan *Client
	broadcast  chan broadcastMsg
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]struct{}),
		byRoom:     make(map[string]map[*Client]struct{}),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan broadcastMsg, 64),
	}
}

func (hub *Hub) Subscribe(client *Client, room string) {
	if client.Rooms == nil {
		client.Rooms = make(map[string]struct{})
	}
	if _, ok := client.Rooms[room]; ok {
		return
	}

	client.Rooms[room] = struct{}{}

	if hub.byRoom[room] == nil {
		hub.byRoom[room] = make(map[*Client]struct{})
	}
	hub.byRoom[room][client] = struct{}{}
}

func (hub *Hub) UnsubscribeAll(client *Client) {
	for room := range client.Rooms {
		if m := hub.byRoom[room]; m != nil {
			delete(m, client)
			if len(m) == 0 {
				delete(hub.byRoom, room)
			}
		}
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
				hub.UnsubscribeAll(client)
				close(client.Send)
			}

		case broadcast := <-hub.broadcast:
			for client := range hub.byRoom[broadcast.room] {
				select {
				case client.Send <- broadcast.msg:
				default:
					delete(hub.clients, client)
					hub.UnsubscribeAll(client)
					close(client.Send)
				}

			}
		}
	}
}

func (hub *Hub) Broadcast(room string, msg Envelope) {
	hub.broadcast <- broadcastMsg{
		room: room,
		msg:  msg,
	}
}
