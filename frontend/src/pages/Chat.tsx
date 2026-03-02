import { ChatRoom } from "../components/ChatRoom"
import MessagesList from "../components/MessagesList"

function Chat() {
    return (
        <div className="flex pl-16 md:pl-64 h-screen">
            <MessagesList />
            <ChatRoom />
        </div>
    )
}

export default Chat