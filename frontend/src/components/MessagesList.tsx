import { LuPencilLine, LuSearch, LuPlus, LuMessageSquareLock } from "react-icons/lu";
import MessageContactItem from "./MessageContactItem";
import Avatar from '../assets/avatar.avif'
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { RoomsTopActionButton } from "./RoomsTopActionButton";
import { NewRoomModal } from "./NewRoomModal";
import { JoinRoomModal } from "./JoinRoomModal copy";

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
    } | null
}

function MessagesList() {

    const apiUrl = import.meta.env.VITE_API_URL as string
    const [rooms, setRooms] = useState<Room[]>([])
    const [loaded, setLoaded] = useState(false)
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

    const convertDate = (date: any) => {
        date = new Date(date)
        return date.toLocaleString();
    }

    const refreshRooms = () => setRefreshTrigger(prev => prev + 1)

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
    }, [apiUrl, refreshTrigger])

    return (
        <div className="w-lg">
            <div className="flex items-center justify-between pl-4 pb-8">
                <h2 className="text-3xl dark:text-white">Messages</h2>
                <div className="flex gap-4">
                    <RoomsTopActionButton Icon={LuPencilLine} tooltipText="New Message" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuSearch} tooltipText="Search" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuPlus} tooltipText="Create Room" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuMessageSquareLock} tooltipText="Join Room" TargetModal={JoinRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                </div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-100/50 w-full h-px mb-6"></div>

            {loaded ? (
                (rooms && rooms.length > 0 ? (
                    rooms.map(room => (
                        <MessageContactItem
                            picture={Avatar}
                            name={room.name}
                            message={room.lastMessage?.body ?? "No messages yet"}
                            sender={room.lastMessage?.senderName}
                            timestamp={room.lastMessage?.createdAt ? convertDate(room.lastMessage?.createdAt) : "-"}
                            key={room.id}
                        />
                    ))) : (<div className="ml-2 flex flex-col items-center p-6 bg-blue-200 dark:bg-slate-900 rounded-xl shadow-xs">
                            <h5 className="mb-3 text-slate-600 text-2xl font-semibold tracking-tight dark:text-slate-200/75">No Rooms Found</h5>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 text-white rounded-xl px-4 py-2 cursor-pointer dark:hover:bg-slate-950"><LuPlus />Create</button>
                                <button className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 text-white rounded-xl px-4 py-2 cursor-pointer dark:hover:bg-slate-950"><LuMessageSquareLock />Join</button>
                            </div>
                        </div>))
            ) : (<p>Loading...</p>)}
        </div>
    )
}

export default MessagesList