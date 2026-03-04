import { LuPencilLine, LuSearch, LuPlus, LuMessageSquareLock } from "react-icons/lu";
import MessageContactItem from "./MessageContactItem";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { RoomsTopActionButton } from "./RoomsTopActionButton";
import { NewRoomModal } from "./NewRoomModal";
import { JoinRoomModal } from "./JoinRoomModal";
import { useWebSocket } from "../hooks/useWebSocket";
import { TimeStampsHandler } from "../utils/TimeStampsHandler";

type Props = {
    ws: ReturnType<typeof useWebSocket>;
    selectedRoomId: string | null;
    onSelectRoom: (id: string) => void;
}

type Room = {
    id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    avatar: string;
    lastMessage: {
        body: string;
        createdAt: string;
        id: string;
        roomId: string;
        senderId: string;
        senderName: string;
    } | null
}

function MessagesList({ ws, selectedRoomId, onSelectRoom }: Props) {

    const apiUrl = import.meta.env.VITE_API_URL as string
    const [rooms, setRooms] = useState<Room[]>([])
    const [loaded, setLoaded] = useState(false)
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
    const { sendJson } = ws;

    const handleJoinRoom = (roomId: string) => {
        sendJson({
            type: "join",
            "room": roomId,
        })

        onSelectRoom(roomId)
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
        <div className="w-lg lg:border-r border-r-slate-200 dark:border-r-slate-100/25">
            <div className="flex items-center justify-between px-4 py-8">
                <h2 className="text-3xl dark:text-white">Messages</h2>
                <div className="flex gap-4">
                    <RoomsTopActionButton Icon={LuPencilLine} tooltipText="New Message" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuSearch} tooltipText="Search" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuPlus} tooltipText="Create Room" TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                    <RoomsTopActionButton Icon={LuMessageSquareLock} tooltipText="Join Room" TargetModal={JoinRoomModal} modalProps={{ onSuccess: refreshRooms }} />
                </div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-100/25 w-full h-px mb-6"></div>

            {loaded ? (
                (rooms && rooms.length > 0 ? (
                    rooms.map(room => (
                        <MessageContactItem
                            picture={room.avatar}
                            name={room.name}
                            message={room.lastMessage?.body ?? "No messages yet"}
                            sender={room.lastMessage?.senderName}
                            timestamp={room.lastMessage?.createdAt ? TimeStampsHandler(room.lastMessage?.createdAt) : "-"}
                            createdBy={room.createdBy}
                            key={room.id}
                            onClick={() => handleJoinRoom(room.id)}
                        />
                    ))) : (<div className="mx-2 flex flex-col items-center p-6 bg-blue-200 dark:bg-slate-900 rounded-xl shadow-xs">
                            <h5 className="mb-3 text-slate-600 text-2xl font-semibold tracking-tight dark:text-slate-200/75">No Rooms Found</h5>
                            <div className="flex gap-3">
                                <button className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 text-white rounded-xl p-1 cursor-pointer dark:hover:bg-slate-950">
                                    <RoomsTopActionButton Icon={LuPlus} tooltipText={"Create new room"} TargetModal={NewRoomModal} modalProps={{ onSuccess: refreshRooms }} classStyles="bg-transparent! gap-1" size={18}>Create</RoomsTopActionButton>
                                </button>
                                <button className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 text-white rounded-xl p-1 cursor-pointer dark:hover:bg-slate-950">
                                    <RoomsTopActionButton Icon={LuMessageSquareLock} tooltipText={"Join room"} TargetModal={JoinRoomModal} modalProps={{ onSuccess: refreshRooms }} classStyles="bg-transparent! gap-1" size={18}>Join</RoomsTopActionButton>
                                </button>
                            </div>
                        </div>))
            ) : (<p>Loading...</p>)}
        </div>
    )
}

export default MessagesList