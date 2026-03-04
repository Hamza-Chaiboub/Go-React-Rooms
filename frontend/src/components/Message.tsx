import Avatar from '../assets/avatar.avif'

type MessageType = {
  side: "in" | "out";
  text?: string;
  time: string;
  avatar?: string;
  sender?: string;
  file?: { name: string, meta: string };
}

export const Message = ({ side, sender, text, time, avatar, file }: MessageType) => {
  const isOut = side === "out"
  const hasFile = !!file?.name;

  return (
    <div className={`flex gap-2.5 my-2 items-end ${isOut ? "justify-end" : "justify-start"}`}>
      {!isOut && (
        <div>
          <img className="w-7 h-7 rounded-full object-cover" src={avatar || Avatar} alt="" />
          <p>{sender}</p>
        </div>
      )}

      <div className={[
        "relative min-w-[30%] max-w-[72%] md:max-w-160 rounded-2xl px-4 pt-3 pb-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]",
        isOut ? "bg-sky-500 text-white rounded-tr-lg" : "bg-slate-100 text-slate-900 rounded-tl-lg",
      ].join(" ")}>
        {hasFile ? (
          <div className={[
            "rounded-xl p-3 grid gap-2",
            isOut ? "bg-white/15 border border-white/25" : "bg-white border border-slate-200",
          ].join(" ")}>
            <div>
              <p className="m-0 text-sm font-semibold">{file!.name}</p>
              <p className={`m-0 text-xs ${isOut ? "text-white/80" : "text-slate-500"}`}>{file!.meta}</p>
            </div>
            <button className={[
              "w-fit rounded-xl px-3 py-2 text-xs font-semibold",
              isOut ? "bg-white text-sky-700 hover:bg-white/90" : "bg-sky-500 text-white hover:bg-sky-600",
            ].join(" ")}>
              Download
            </button>
          </div>
        ) : (
          <p className="m-0 text-sm leading-snug">{text}</p>
        )}

        <span className="absolute right-3 bottom-1.5 text-[11px] opacity-75">{time}</span>
      </div>
    </div>
  );
}