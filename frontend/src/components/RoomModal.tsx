import type { ComponentType } from "react";

type RoomModaltype = {
    CustomModal: ComponentType<{ isOpen: boolean, handleClose: () => void }>;
    isOpen: boolean;
    handleClose: () => void;
    modalProps?: Record<string, unknown>;
}

export const RoomModal = ({CustomModal, isOpen, handleClose, modalProps = {}} : RoomModaltype) => {
    return (
        <CustomModal isOpen={isOpen} handleClose={handleClose} {...modalProps} />
    )
}