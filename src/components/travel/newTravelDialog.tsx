import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import myTravelService from '../../services/myTravelService';
import { MyTravel } from '../../types';
import { useAuth } from '../../context/authContext';

interface NewTravelDialogProps {
    open: boolean;
    onClose: () => void;
    onTravelAdded: () => void; // Yeni seyahat eklenince bu fonksiyon çağrılacak
}

const NewTravelDialog: React.FC<NewTravelDialogProps> = ({ open, onClose, onTravelAdded }) => {
    const { user } = useAuth();

    const [myTravel, setMyTravel] = useState<Partial<MyTravel>>({
        travelerid: user?.travelerId || "",
        name: "",
        country: "",
        city: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        if (user?.travelerId) {
            setMyTravel((prev) => ({ ...prev, travelerid: user.travelerId }));
        }
    }, [user?.travelerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMyTravel((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddMyTravel = async () => {
        try {
            const response = await myTravelService.AddOrUpdateMyTravel(myTravel);
            alert("Seyahat başarıyla eklendi.");
            onTravelAdded(); // Seyahat başarıyla eklendiğinde listeyi güncelle
            onClose();
        } catch (error) {
            console.error("Seyahat eklenirken hata oluştu:", error);
            alert("Seyahat eklenirken hata oluştu!");
        }
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
                    name="name"
                    value={myTravel.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Ülke"
                    name="country"
                    value={myTravel.country}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Şehir"
                    name="city"
                    value={myTravel.city}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Başlangıç Tarihi"
                    type="date"
                    name="startDate"
                    value={myTravel.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Bitiş Tarihi"
                    type="date"
                    name="endDate"
                    value={myTravel.endDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Vazgeç</Button>
                <Button onClick={handleAddMyTravel}>
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewTravelDialog;
