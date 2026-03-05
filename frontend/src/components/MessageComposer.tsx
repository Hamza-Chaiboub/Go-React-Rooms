import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicNoneIcon from "@mui/icons-material/MicNone";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import type { useWebSocket } from "../hooks/useWebSocket";
import { useState } from "react";

export const MessageComposer = ({ ws, roomId }: {ws: ReturnType<typeof useWebSocket>; roomId: string | null}) => {

    const [message, setMessage] = useState<string>("")
    const [isSending, setIsSending] = useState(false)
    const { sendJson } = ws

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }

    const handleEnterKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault()
                sendMessageViaWebSocket()
                console.log('enter key pressed')
            }
        }
    }

    const sendMessageViaWebSocket = () => {
        setIsSending(true)
        if (message === "") return;
        sendJson({
            type: "message",
            room: roomId,
            text: message
        })
        setMessage("") 
        setIsSending(false)
    }

    return (
        <footer className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-t border-slate-100 bg-slate-50 dark:bg-slate-950">
            <button
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
                aria-label="Attach"
            >
                <AttachFileIcon fontSize="small" />
            </button>

            <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2">
                <textarea
                    className="w-full bg-transparent outline-none border-0 text-sm placeholder:text-slate-400 resize-none"
                    placeholder="Write a message…"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleEnterKeyDown}
                />
            </div>

            <button
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
                aria-label="Voice"
            >
                <MicNoneIcon fontSize="small" />
            </button>

            <button
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
                aria-label="Emoji"
            >
                <SentimentSatisfiedAltIcon fontSize="small" />
            </button>

            <button
                className="w-11 h-11 rounded-full bg-sky-500 text-white grid place-items-center hover:bg-sky-600"
                aria-label="Send"
                onClick={sendMessageViaWebSocket}
                disabled={isSending}
            >
                <SendIcon fontSize="small" />
            </button>
        </footer>
    )
}