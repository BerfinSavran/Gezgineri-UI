
import { TextareaAutosize, Container, Typography, Stack, Box, TextField, Card, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { Tour } from "../types";
import tourService from "../services/tourService";

export default function AddTourPage() {
    const { user } = useAuth();
    const [tour, setTour] = useState<Partial<Tour>>({
        name: "",
        startDate: "",
        endDate: "",
        price: 0,
        capacity: 0,
        description: ""
    });


    useEffect(() => {
    }, []);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setTour((prev) => ({ ...prev, [name]: value }));
    };


    const handleAddTour = async () => {
        try {
            const agencyId = user?.agencyId;
            const newTour = { ...tour, agencyId };
            await tourService.AddOrUpdateTour(newTour);
            alert("Tur başarıyla eklendi!");
            setTour({
                name: "",
                startDate: "",
                endDate: "",
                price: 0,
                capacity: 0,
                description: ""
            });
        } catch (error) {
            console.error("Tur eklenirken hata oluştu:", error);
            alert("Tur eklenirken hata oluştu!");
        }
    };



    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>Yeni Tur Ekle</Typography>
                    <Box>
                        <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleAddTour}>
                            Ekle
                        </Button>
                    </Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="column" sx={{ width: "550px", ml: "20px", mt: "10px" }}>
                        <Card sx={{
                            width: "95%",
                            height: "400px",
                            border: "1px solid",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            color: "gray"
                        }}>
                            Fotoğraf
                        </Card>
                    </Stack>

                    <Card sx={{
                        width: "800px",
                        height: "400px",
                        border: "1px solid",
                        mr: "23px", mt: "10px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                        <TextField
                            label="Tur Adı"
                            variant="outlined"
                            size="small"
                            fullWidth name="name"
                            value={tour.name}
                            onChange={handleInputChange}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Başlangıç tarihi"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="startDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={tour.startDate}
                            onChange={handleInputChange}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Bitiş Tarihi"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="endDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={tour.endDate}
                            onChange={handleInputChange}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Tur Ücreti"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="price"
                            value={tour.price}
                            onChange={handleInputChange}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Kapasite"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="capacity"
                            value={tour.capacity}
                            onChange={handleInputChange}
                            sx={{ mb: 1 }}
                        />
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Açıklama"
                            name="description"
                            value={tour.description}
                            onChange={handleInputChange}
                            style={{ width: "100%", marginBottom: "8px" }}
                        />
                    </Card>
                </Stack>
            </Card>
            
        </Container>
    );
}
