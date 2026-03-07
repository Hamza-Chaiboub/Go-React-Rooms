import { Avatar } from "@mui/material";
import { useProtectedRoutes } from "../hooks/useProtectedRoutes";

interface MessageContactItemProps {
    picture?: string;
    name: string;
    message: string;
    sender?: string;
    timestamp: string;
    tailwindClasses?: string;
    isOnline?: boolean;
    createdBy: string;
    onClick?: any;
    id: string;
}

function MessageContactItem({picture, name, message, sender = "bot", timestamp, tailwindClasses = "", isOnline = true, createdBy, onClick, id} : MessageContactItemProps) {
    const [me,] = useProtectedRoutes()
    const mine = me?.id === createdBy
    const online = isOnline ? 'bg-green-500' : '';

    const firstLetters = (name: string) : string => {
        return name.split(' ').map(word => word[0]).slice(0, 2).join('')
    }

    return (
        <div id={id} onClick={onClick} className={`p-4 rounded-2xl flex justify-between items-center w-11/12 cursor-pointer ml-2 text-black dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${tailwindClasses}`}>
            <div className="flex gap-2 flex-1 min-w-0">
                <div className="relative group">
                    <Avatar src={picture ?? ''} alt={name}>{picture ? '' : firstLetters(name)}</Avatar>
                    <div className={`absolute bottom-0 left-3/4 w-3 h-3 rounded-full ${online}`}></div>
                </div>
                <div className="min-w-0">
                    <p className="font-bold">{name} <span className="opacity-50 font-extralight">{(mine ? "(mine)" : "")}</span></p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-500 mr-4 truncate">{sender}: {message}</p>
                </div>
            </div>
            <div className="text-xs text-zinc-500">{timestamp}</div>
        </div>
    )
}

export default MessageContactItem