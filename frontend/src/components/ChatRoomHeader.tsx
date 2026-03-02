import Avatar from "../assets/avatar.avif";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export const ChatRoomHeader = () => {
    return (
        <header className="shrink-0 flex items-center justify-between px-5 py-8 bg-white dark:bg-slate-950">
            <div className="flex items-center gap-3">
            <img className="w-10 h-10 rounded-full object-cover" src={Avatar} alt="Chat avatar" />
            <div className="leading-tight">
                <p className="m-0 font-semibold text-slate-900 dark:text-slate-200">Hamza Chaiboub</p>
                <p className="m-0 text-xs text-slate-500 dark:text-slate-300">Active</p>
            </div>
            </div>

            <div className="flex items-center gap-2">
            <button
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
                aria-label="Search"
            >
                <SearchIcon fontSize="small" />
            </button>
            <button
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50"
                aria-label="Invite"
            >
                <PersonAddAlt1Icon fontSize="small" />
            </button>
            </div>
        </header>
    )
}