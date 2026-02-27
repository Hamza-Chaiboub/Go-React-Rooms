import { useProtectedRoutes } from "../hooks/useProtectedRoutes";

interface MessageContactItemProps {
    picture: string;
    name: string;
    message: string;
    sender?: string;
    timestamp: string;
    tailwindClasses?: string;
    isOnline?: boolean;
    createdBy: string;
}

function MessageContactItem({picture, name, message, sender = "bot", timestamp, tailwindClasses, isOnline = true, createdBy} : MessageContactItemProps) {
    const [me,] = useProtectedRoutes()
    const mine = me?.id === createdBy
    const online = isOnline ? 'bg-green-500' : '';
    return (
        <div className={`p-4 rounded-2xl flex justify-between items-center w-full cursor-pointer ml-2 text-black dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${tailwindClasses}`}>
            <div className="flex gap-2">
                <div className="relative">
                    <img src={picture} className="rounded-full w-12 h-12 object-cover" alt="" />
                    <div className={`absolute bottom-0 left-3/4 w-3 h-3 rounded-full ${online}`}></div>
                </div>
                <div>
                    <p className="font-bold">{name} <span className="opacity-50 font-extralight">{(mine ? "(mine)" : "")}</span></p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-500 truncate w-64">{sender}: {message}</p>
                </div>
            </div>
            <div className="text-xs text-zinc-500">{timestamp}</div>
        </div>
    )
}

export default MessageContactItem