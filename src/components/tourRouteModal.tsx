import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack } from '@mui/material';
import { TourRoute } from '../types';
import tourRouteService from '../services/tourRouteService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';

export default function TourRouteModal({
    open,
    handleClose,
    tourId,
    initialData = null,
    onRouteUpdated,
}: {
    open: boolean;
    handleClose: () => void;
    tourId: string;
    initialData?: TourRoute | null;
    onRouteUpdated?: () => void;
}) {
    const [formData, setFormData] = useState<TourRoute>({
        tourId: tourId,
        location: '',
        order: 1,
        date: "",
        description: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date ? new Date(initialData.date + "Z").toISOString().split('T')[0] : "",
            });
        } else {
            setFormData({
                tourId,
                location: '',
                order: 1,
                date: new Date().toISOString().split('T')[0],
                description: '',
                imageUrl: '',
            });
        }
    }, [initialData, tourId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            date: e.target.value,
        }));
    };

    const handleSaveClick = async () => {
        try {
            const { id, ...dataToSave } = formData;
            if (id) {
                await tourRouteService.AddOrUpdateTourRoute({ ...dataToSave, id });
                showSuccessToast('Rota başarıyla güncellendi!');
                onRouteUpdated?.();
            } else {
                await tourRouteService.AddOrUpdateTourRoute(dataToSave);
                showSuccessToast('Tur rotası başarıyla eklendi!');
            }
            handleClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur rotası kaydedilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Tur Rotasını Düzenle' : 'Tur Rotası Ekle'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label="Lokasyon"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Sıra"
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Tarih"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Açıklama"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Görsel URL"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    İptal
                </Button>
                <Button onClick={handleSaveClick} color="primary">
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
}
