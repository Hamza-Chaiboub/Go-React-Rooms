import Avatar from "../assets/avatar.avif";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { Message } from "./Message";
import { MessageComposer } from "./MessageComposer";
import { useWebSocket } from "../hooks/useWebSocket";
import { TimeStampsHandler } from "../utils/TimeStampsHandler";

type Props = { ws: ReturnType<typeof useWebSocket> }

type Envelope = {
  type: "message" | "ack" | "error" | "join";
  room?: string;
  text?: string;
  from?: string;
  ts?: string;
  messageId?: string;
  error?: string;
}

export const ChatRoom = ({ ws }: Props) => {
  const { messages } = ws;
  const envelopes = messages
    .filter((m): m is Envelope => typeof m === "object" && m !== null && "type" in m)
    .filter((e) => e.type === "message");

  return (
    <section className="w-full h-full min-h-0 bg-white overflow-hidden dark:bg-slate-950 flex flex-col">
      <ChatRoomHeader />
      <div className="bg-slate-200 dark:bg-slate-100/25 w-full h-px"></div>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-white dark:bg-slate-900">
        {envelopes.map((e) => (
            <Message
              key={e.messageId ?? e.ts}
              side={"in"}
              text={e.text}
              time={TimeStampsHandler(e.ts ?? "") ?? ""}
              avatar={Avatar}
              file={{name: "", meta: ""}}
            />
        ))}
      </div>
      <MessageComposer />
    </section>
  );
};