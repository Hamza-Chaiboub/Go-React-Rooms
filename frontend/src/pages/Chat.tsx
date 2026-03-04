import { useState } from "react"
import { ChatRoom } from "../components/ChatRoom"
import MessagesList from "../components/MessagesList"
import { useWebSocket } from "../hooks/useWebSocket"

function Chat() {
    const ws = useWebSocket("ws://localhost:8080/ws")
    const [roomId, setRoomId] = useState<string | null>(null)
    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start pl-16 md:pl-64 h-screen">
            <MessagesList ws={ws} selectedRoomId={roomId} onSelectRoom={setRoomId} />
            <ChatRoom ws={ws} roomId={roomId} />
        </div>
    )
}

export default Chat