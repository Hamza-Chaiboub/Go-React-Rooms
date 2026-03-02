import {Box, Modal, TextField, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { apiFetch } from '../api/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
};

type NewRoomModaltype = {
    isOpen: boolean;
    handleClose: () => void;
    onSuccess?: () => void;
}

export const NewRoomModal = ({isOpen, handleClose, onSuccess} : NewRoomModaltype) => {
    const apiUrl = import.meta.env.VITE_API_URL as string
    const [roomName, setRoomName] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setErrorMessage(null)
        try {
            const res = await apiFetch(`${apiUrl}`, "/rooms", {
                method: "POST",
                body: JSON.stringify({
                    name: roomName
                })
            })

            if (!res.ok) {
                let errorText = `Request failed with status ${res.status}`
                try {
                    const errorData =await res.json()
                    errorText = errorData.error || errorData 
                } catch {
                    errorText = res.statusText || errorText
                }
                throw new Error(errorText)
            }

            handleClose()
            setRoomName("")
            onSuccess?.()

        } catch (error) {
            console.log('error creating room level two', error)
            setErrorMessage(error instanceof Error ? error.message : "Unknown error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
        >
            <Box sx={style} className="bg-white dark:text-white dark:bg-slate-900 rounded-xl">
                <div className='flex justify-between px-6 py-4'>
                    <h1 className='text-xl font-bold'>Create New Room</h1>
                    <CloseIcon className='cursor-pointer text-slate-600 hover:text-slate-400' onClick={handleClose} />
                </div>
                <hr className='text-slate-100/10' />
                <div className='px-6 py-4'>
                    <h2 className='text-lg mb-4'>Room</h2>
                    <TextField
                        placeholder='Room (ex: Gaming)'
                        className='bg-slate-100 dark:bg-slate-300 rounded-lg w-full capitalize'
                        onChange={handleNameChange}
                        value={roomName}
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                </div>
                <div className='flex flex-col gap-4 px-6 py-4 mt-4'>
                    <Button
                        onClick={handleSubmit}
                        variant='contained'
                        className='dark:bg-slate-600! w-full py-2! rounded-lg!'
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose} variant='contained' className='dark:bg-slate-800! w-full py-2! rounded-lg!'>Cancel</Button>
                </div>
            </Box>
        </Modal>
    )
}