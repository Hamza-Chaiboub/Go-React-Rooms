import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicNoneIcon from "@mui/icons-material/MicNone";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";

export const MessageComposer = () => {
    return (
        <footer className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-t border-slate-100 bg-slate-50 dark:bg-slate-950">
            <button
            className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
            aria-label="Attach"
            >
            <AttachFileIcon fontSize="small" />
            </button>

            <div className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2">
            <input
                className="w-full bg-transparent outline-none border-0 text-sm placeholder:text-slate-400"
                placeholder="Write a message…"
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
            >
            <SendIcon fontSize="small" />
            </button>
        </footer>
    )
}