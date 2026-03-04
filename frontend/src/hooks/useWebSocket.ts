import { useEffect, useRef, useState, useCallback } from "react";

type Message = string | Record<string, unknown>;
type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const didInitRef = useRef(false);
  const [status, setStatus] = useState<WSStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);

  const connect = useCallback(() => {
    const existing = wsRef.current;
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
    };

    ws.onmessage = (event) => {
      const raw = event.data;
      let parsed: Message = raw;

      if (typeof raw === "string") {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = raw;
        }
      }

      setMessages((prev) => [...prev, parsed]);
    };

    ws.onerror = (event) => {
      setStatus("error");
      console.log("[ws] error:", event);
    };

    ws.onclose = (event) => {
      setStatus("closed");
      console.log("[ws] close:", { code: event.code, reason: event.reason, wasClean: event.wasClean });
      wsRef.current = null;
    };
  }, [url]);

  const disconnect = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.close(1000, "client close");
    }
    setStatus("closed");
  }, []);

  const sendJson = useCallback((payload: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(payload));
    return true;
  }, []);

  const sendText = useCallback((text: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(text);
    return true;
  }, []);

  useEffect(() => {
    // this guard prevents the first mount from creating a socket that immediately gets closed. (I learned this the hard way LoL)
    if (import.meta.env.DEV) {
      if (didInitRef.current) {
        connect();
      } else {
        didInitRef.current = true;
      }
    } else {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { status, messages, connect, disconnect, sendJson, sendText, ws: wsRef.current };
}