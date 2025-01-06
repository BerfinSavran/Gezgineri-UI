import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface NewTravelDialogProps {
    open: boolean;
    onClose: () => void;
}

const NewTravelDialog: React.FC<NewTravelDialogProps> = ({ open, onClose }) => {
    const [days, setDays] = useState(1);

    const handleAddDays = () => {
        // Modalda gün sayısını arttırmak için gerekli işlemler
        // Burada gün sayısını ayarlayın ve diğer bileşeni açın
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Yeni Seyahat Oluşturun
                <IconButton 
                    aria-label="close" 
                    onClick={onClose} 
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Seyahat Başlığı" 
                    fullWidth 
                />
                <TextField 
                    margin="dense" 
                    label="Lokasyon" 
                    fullWidth 
                />
                <TextField
                    margin='dense'
                    label="Tarih"
                    type='number'
                    onChange={(e) => setDays(Number(e.target.value))}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Vazgeç</Button>
                <Button onClick={onClose}>Kaydet</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewTravelDialog;
