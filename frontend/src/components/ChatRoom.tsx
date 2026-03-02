import Avatar from "../assets/avatar.avif";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { Message } from "./Message";
import { MessageComposer } from "./MessageComposer";

type Msg = {
  id: string;
  side: "in" | "out";
  text?: string;
  time: string;
  avatar?: string;
  file?: { name: string; meta: string };
};

const demo: Msg[] = [
  {
    id: "1",
    side: "in",
    text: "“Content here, content here”, making it look like readable English",
    time: "10:54 pm",
    avatar: Avatar,
  },
  {
    id: "2",
    side: "out",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:54 pm",
  },
  {
    id: "3",
    side: "in",
    text: "“Content here, content here”, making it look like readable English",
    time: "10:54 pm",
    avatar: Avatar,
  },
  {
    id: "4",
    side: "out",
    time: "10:55 pm",
    file: { name: "Brief.ppt", meta: "No virus, 50.54 MB" },
  },
  {
    id: "5",
    side: "out",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:56 pm",
  },
  {
    id: "6",
    side: "in",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:56 pm",
  },
  {
    id: "7",
    side: "out",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:56 pm",
  },
  {
    id: "8",
    side: "out",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:56 pm",
  },
  {
    id: "9",
    side: "out",
    text: "“Content here, content here”… making it look like readable English",
    time: "10:56 pm",
  },
  {
    id: "10",
    side: "in",
    time: "10:55 pm",
    file: { name: "Brief.ppt", meta: "No virus, 50.54 MB" },
  },
  {
    id: "11",
    side: "in",
    time: "10:55 pm",
    file: { name: "Brief.ppt", meta: "No virus, 50.54 MB" },
  },
];

export const ChatRoom = () => {
  return (
    <section className="w-full h-full min-h-0 bg-white overflow-hidden dark:bg-slate-950 flex flex-col">
      <ChatRoomHeader />
      <div className="bg-slate-200 dark:bg-slate-100/25 w-full h-px"></div>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-white dark:bg-slate-900">
        {demo.map((m) => {
            return <Message id={m.id} side={m.side} text={m.text} time={m.time} avatar={m.avatar} file={m.file} />
        })}
      </div>
      <MessageComposer />
    </section>
  );
};