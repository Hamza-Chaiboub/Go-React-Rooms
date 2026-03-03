import { ChatRoom } from "../components/ChatRoom"
import MessagesList from "../components/MessagesList"
import { useWebSocket } from "../hooks/useWebSocket"

function Chat() {
    const ws = useWebSocket("ws://localhost:8080/ws")
    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start pl-16 md:pl-64 h-screen">
            <MessagesList ws={ws} />
            <ChatRoom ws={ws} />
        </div>
    )
}

export default Chat