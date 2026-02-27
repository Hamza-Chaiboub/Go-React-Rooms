import {Box, Typography, Modal} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type JoinRoomModaltype = {
    isOpen: boolean;
    handleClose: () => void;
}

export const JoinRoomModal = ({isOpen, handleClose} : JoinRoomModaltype) => {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Join Room
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Test description later for joining room
            </Typography>
            </Box>
        </Modal>
    )
}