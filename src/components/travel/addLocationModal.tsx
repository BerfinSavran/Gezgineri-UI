import React from 'react';
import { Modal, Box, Typography, Button, Card, CardContent } from '@mui/material';

interface AddLocationModalProps {
    open: boolean;
    onClose: () => void;
    onAddLocation: (location: string) => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ open, onClose, onAddLocation }) => {
    const favoriteLocations = ['Favori Mekan 1', 'Favori Mekan 2', 'Favori Mekan 3']; // Favori mekanlarınızı buradan alabilirsiniz

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, maxWidth: 400, margin: 'auto', mt: '20%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Favori Mekanlar</Typography>
                {favoriteLocations.map((location, index) => (
                    <Card key={index} sx={{ mb: 1 }}>
                        <CardContent>
                            <Typography>{location}</Typography>
                            <Button variant="contained" size="small" onClick={() => onAddLocation(location)}>Ekle</Button>
                        </CardContent>
                    </Card>
                ))}
                <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>Kapat</Button>
            </Box>
        </Modal>
    );
};

export default AddLocationModal;
