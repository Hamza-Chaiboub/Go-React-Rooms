import Avatar from "../assets/avatar.avif";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { Message } from "./Message";
import { MessageComposer } from "./MessageComposer";
import { useWebSocket } from "../hooks/useWebSocket";
import { TimeStampsHandler } from "../utils/TimeStampsHandler";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

const LIMIT_MESSAGES_LOAD = 15
const TOP_THRESHOLD_PIXELS = 40
const BOTTOM_THRESHOLD_PIXELS = 2000 // a workaround for now, I can't figure it out this late at night

export const ChatRoom = ({ ws, roomId }: {ws: ReturnType<typeof useWebSocket>; roomId: string | null}) => {
  const apiUrl = import.meta.env.VITE_API_URL as string
  const [history, setHistory] = useState<ServerMsg[]>([])
  const [loading, setLoading] = useState(false)
  const [loadMoreMessages, setLoadMoreMessages] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const [me,] = useProtectedRoutes()
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const isPrependingRef = useRef(false)
  const prevScrollHeightRef = useRef(0)
  const initialScrollDone = useRef(false)
  const wasNearBottom = useRef(true)
  
  const isNearBottom = () => {
    const el = scrollerRef.current
    if (!el) return true
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    return distance < BOTTOM_THRESHOLD_PIXELS
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  const loadOldMessages = useCallback(() => {
    if (loading || !roomId || !lastMessageId) return
    setLoadMoreMessages(true)
    console.log("loading more...")
  }, [roomId, lastMessageId, loading])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      wasNearBottom.current = isNearBottom()

      if (el.scrollTop <= TOP_THRESHOLD_PIXELS && initialScrollDone.current) {
        // Avoid triggering while already loading
        if (!loadMoreMessages && lastMessageId) {
          isPrependingRef.current = true
          prevScrollHeightRef.current = el.scrollHeight
          loadOldMessages()
        }
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [loadMoreMessages, lastMessageId, loadOldMessages])

  useEffect(() => {
    if (!roomId) return
    setLoading(true)

    const fetchInitial = async () => {
      try {
        const res = await apiFetch(apiUrl, `/rooms/messages?roomId=${roomId}&limit=${LIMIT_MESSAGES_LOAD}`)
        const data = await res.json()
        setHistory(data.messages)
        setLastMessageId(data.nextBefore)
      } catch (error) {
        console.error("Failed to load messages:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [apiUrl, roomId])

  useEffect(() => {
    if (!loading && history.length > 0 && !initialScrollDone.current && scrollerRef.current) {
      scrollToBottom('auto')
      initialScrollDone.current = true
      wasNearBottom.current = true
    }
  }, [loading, history])

  useEffect(() => {
    if (!loadMoreMessages || !roomId || !lastMessageId) return

    const fetchMore = async () => {
      try {
        const res = await apiFetch(apiUrl, `/rooms/messages?roomId=${roomId}&before=${lastMessageId}&limit=${LIMIT_MESSAGES_LOAD}`)
        const data = await res.json()

        if (!data.messages || data.messages.length === 0) {
          setLastMessageId(null)
          return
        }

        setHistory(prev => [...data.messages, ...prev])
        setLastMessageId(data.nextBefore ?? null)
      } catch (error) {
        console.error("Failed to load more messages:", error)
      } finally {
        setLoadMoreMessages(false)
      }
    }
    fetchMore()
  }, [apiUrl, roomId, loadMoreMessages, lastMessageId])

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el || !isPrependingRef.current) return

    const newScrollHeight = el.scrollHeight
    const delta = newScrollHeight - prevScrollHeightRef.current
    el.scrollTop = delta

    isPrependingRef.current = false
  }, [history])

  const live = useMemo(() => {
    return ws.messages
      .filter((m): m is Envelope => typeof m === "object" && m !== null && "type" in m)
      .filter((e) => e.type === "message" && e.room === roomId)
  }, [ws.messages, roomId])

  useEffect(() => {
    if (isPrependingRef.current) return

    if (wasNearBottom.current && live.length > 0) {
      scrollToBottom('smooth')
      wasNearBottom.current = true
    }
  }, [live.length])

  const merged = useMemo(() => {
    const map = new Map<string, { id: string; text: string; ts: string; from: string; sender: string }>()

    if (history) {
      for (const m of history) {
        map.set(m.id, { id: m.id, text: m.body, ts: m.createdAt, from: m.senderId, sender: m.senderName })
      }
    }
    for (const e of live) {
      if (!e.messageId) continue
      map.set(e.messageId, { id: e.messageId, text: e.text ?? "", ts: e.ts ?? "", from: e.from ?? "", sender: e.senderName })
    }

    return Array.from(map.values()).sort((a, b) => +new Date(a.ts) - +new Date(b.ts))
  }, [history, live])

  return (
    <section className="w-full h-full min-h-0 bg-white overflow-hidden dark:bg-slate-950 flex flex-col">
      {!roomId ? (
        <div className="text-slate-500">Select a room</div>
      ) : loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <>
          <ChatRoomHeader />
          <div className="bg-slate-200 dark:bg-slate-100/25 w-full h-px"></div>
          <div ref={scrollerRef} className="flex-1 min-h-0 overflow-y-auto p-5 bg-white dark:bg-slate-900">
            {merged.length > 0 ? (
              merged.map((m) => (
                <Message
                  key={m.id ?? m.ts}
                  sender={m.sender}
                  side={me?.id === m.from ? "out" : "in"}
                  text={m.text}
                  time={TimeStampsHandler(m.ts ?? "") ?? ""}
                  avatar={Avatar}
                  file={{ name: "", meta: "" }}
                />
              ))
            ) : (
              <div className="text-slate-500 bg-slate-100 p-4 rounded-lg">Empty</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <MessageComposer ws={ws} roomId={roomId} />
        </>
      )}
    </section>
  )
}