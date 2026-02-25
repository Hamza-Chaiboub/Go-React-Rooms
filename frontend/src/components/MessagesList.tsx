import { LuPencilLine, LuSearch } from "react-icons/lu";
import MessageContactItem from "./MessageContactItem";
import Avatar from '../assets/avatar.avif'
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

type Room = {
    id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    lastMessage: {
        body: string;
        createdAt: string;
        id: string;
        roomId: string;
        senderId: string;
        senderName: string;
    }
}

function MessagesList() {

    const apiUrl = import.meta.env.VITE_API_URL as string
    const [rooms, setRooms] = useState<Room[]>([])
    const [loaded, setLoaded] = useState(false)
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)

    const convertDate = (date: any) => {
        date = new Date(date)
        return date.toLocaleString();
    }

    useEffect(() => {
        if (isLoadingRooms) return;
        async function getRooms() {
            try {
                const res = await apiFetch(`${apiUrl}`, "/rooms")

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }

                const roomsData = await res.json()
                setRooms(roomsData.rooms)
                console.log(roomsData.rooms)
                setLoaded(true)


            } catch (e) {
                console.log("error fetching rooms: ", e)
            } finally {
                setIsLoadingRooms(false)
            }
        }

        getRooms()
    }, [apiUrl])

    return (
        <div className="w-lg">
            <div className="flex items-center justify-between pl-4 pb-8">
                <h2 className="text-3xl dark:text-white">Messages</h2>
                <div className="flex gap-4">
                    <div className="bg-zinc-100 dark:bg-zinc-300 rounded-full p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-400">
                        <LuPencilLine size={24} />
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-300 rounded-full p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-400">
                        <LuSearch size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-zinc-200 dark:bg-zinc-100/50 w-full h-px mb-6"></div>

            {loaded && rooms.map(room => (
                <MessageContactItem
                    picture={Avatar}
                    name={room.name}
                    message={room.lastMessage.body}
                    sender={room.lastMessage.senderName}
                    timestamp={convertDate(room.lastMessage.createdAt)}
                    key={room.id}
                />
            ))}
        </div>
    )
}

export default MessagesList