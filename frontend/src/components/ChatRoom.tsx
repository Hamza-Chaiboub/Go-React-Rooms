import Avatar from "../assets/avatar.avif";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { Message } from "./Message";
import { MessageComposer } from "./MessageComposer";
import { useWebSocket } from "../hooks/useWebSocket";
import { TimeStampsHandler } from "../utils/TimeStampsHandler";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../api/api";
import { useProtectedRoutes } from "../hooks/useProtectedRoutes";

type Envelope = {
  type: "message" | "ack" | "error" | "join";
  room?: string;
  text?: string;
  from?: string;
  ts?: string;
  messageId?: string;
  error?: string;
  senderName: string;
}

type ServerMsg = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  senderName: string
}

const LIMIT_MESSAGES_LOAD = 20

export const ChatRoom = ({ ws, roomId }: {ws: ReturnType<typeof useWebSocket>; roomId: string | null}) => {
  const apiUrl = import.meta.env.VITE_API_URL as string
  const [history, setHistory] = useState<ServerMsg[]>([])
  const [loading, setLoading] = useState(false)
  const [me,] = useProtectedRoutes()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom();
  }, [ws.messages, history])

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);

    (async () => {
      const res = await apiFetch(apiUrl, `/rooms/messages?roomId=${roomId}&limit=${LIMIT_MESSAGES_LOAD}`)
      const data = await res.json()

      setHistory(data.messages)
      console.log(data)
      setLoading(false)
    })().catch(() => setLoading(false))
  }, [apiUrl, roomId])

  const live = useMemo(() => {
    return ws.messages
      .filter((m): m is Envelope => typeof m === "object" && m !== null && "type" in m)
      .filter((e) => e.type === "message" && e.room === roomId)
  }, [ws.messages, roomId])

  const merged = useMemo(() => {
    const map = new Map<string, { id: string; text: string; ts: string; from: string; sender: string }>();

    if (history) {
      for (const m of history) {
        map.set(m.id, { id: m.id, text: m.body, ts: m.createdAt, from: m.senderId, sender: m.senderName });
      }
    }
    for (const e of live) {
      if (!e.messageId) continue;
      map.set(e.messageId, { id: e.messageId, text: e.text ?? "", ts: e.ts ?? "", from: e.from ?? "", sender: e.senderName });
    }

    return Array.from(map.values()).sort((a, b) => +new Date(a.ts) - +new Date(b.ts))
  }, [history, live])

  return (
    <section className="w-full h-full min-h-0 bg-white overflow-hidden dark:bg-slate-950 flex flex-col">
      {!roomId ? (
          <div className="text-slate-500">Select a room</div>
        ) : (loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <>
          <ChatRoomHeader />
          <div className="bg-slate-200 dark:bg-slate-100/25 w-full h-px"></div>
          <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-white dark:bg-slate-900">
            
            {merged.length > 0 ? merged.map((m) => (
                <Message
                  key={m.id ?? m.ts}
                  sender={m.sender}
                  side={me?.id === m.from ? "out" : "in"}
                  text={m.text}
                  time={TimeStampsHandler(m.ts ?? "") ?? ""}
                  avatar={Avatar}
                  file={{name: "", meta: ""}}
                />
            )) : (<div className="text-slate-500 bg-slate-100 p-4 rounded-lg">Empty</div>)}
            <div ref={messagesEndRef} />
          </div>
          <MessageComposer ws={ws} roomId={roomId} />
          </>
        )
      )
      }
    </section>
  );
};