import { useState, type ComponentType } from "react";
import type { IconType } from "react-icons"
import { RoomModal } from "./RoomModal";

type RoomsTopActionButtonProps = {
    Icon: IconType;
    tooltipText: string;
    TargetModal: ComponentType<{ isOpen: boolean, handleClose: () => void }>
    modalProps: Record<string, unknown>
}

export const RoomsTopActionButton = ({Icon, tooltipText, TargetModal, modalProps = {}} : RoomsTopActionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
        console.log('handleClose called');
    }

    return (
        <>
        <div onClick={handleOpen} className="relative group bg-zinc-100 dark:bg-zinc-300 rounded-full p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-400">
            <Icon size={24} />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 mt-1 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-700 text-sm rounded shadow-lg w-max">
                {tooltipText}
            </div>
        </div>
        <RoomModal CustomModal={TargetModal} isOpen={isOpen} handleClose={handleClose} modalProps={modalProps} />
        </>
    )
}