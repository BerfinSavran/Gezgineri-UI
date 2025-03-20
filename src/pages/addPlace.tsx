
import { TextareaAutosize, Container, Typography, Stack, Box, TextField, Card, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import placeService from "../services/placeService";
import { useAuth } from "../context/authContext";
import { Category, Place } from "../types";
import categoryService from "../services/categoryService";

export default function AddPlacePage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [place, setPlace] = useState<Partial<Place>>({
        name: "",
        categoryId: "",
        country: "",
        city: "",
        entryPrice: 0,
        capacity: 0,
        description: ""
    });


    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const fetchedCategories = await categoryService.GetAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Kategoriler alınırken hata oluştu:", error);
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPlace((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        setPlace((prev) => ({ ...prev, categoryId: event.target.value }));
    };


    const handleAddPlace = async () => {
        try {
            const ownerId = user?.ownerId;
            const newPlace = { ...place, ownerId };
            await placeService.AddOrUpdatePlace(newPlace);
            alert("Yer başarıyla eklendi!");
            setPlace({
                name: "",
                categoryId: "",
                country: "",
                city: "",
                entryPrice: 0,
                capacity: 0,
                description: ""
            });
        } catch (error) {
            console.error("Yer eklenirken hata oluştu:", error);
            alert("Yer eklenirken hata oluştu!");
        }
    };

    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>Yeni Mekan Ekle</Typography>
                    <Box>
                        <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleAddPlace}>
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
                        <TextField label="Yer Adı" variant="outlined" size="small" fullWidth name="name" value={place.name} onChange={handleInputChange} sx={{ mb: 1 }} />
                        {/* Kategori Select */}
                        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 1 }}>
                            <InputLabel>Kategori</InputLabel>
                            <Select
                                name="categoryId"
                                value={place.categoryId}
                                onChange={handleCategoryChange}
                                label="Kategori"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Ülke" variant="outlined" size="small" fullWidth name="country" value={place.country} onChange={handleInputChange} sx={{ mb: 1 }} />
                        <TextField label="Şehir" variant="outlined" size="small" fullWidth name="city" value={place.city} onChange={handleInputChange} sx={{ mb: 1 }} />
                        <TextField label="Gezi Süresi" variant="outlined" size="small" fullWidth name="visitDuration" value={place.visitDuration} onChange={handleInputChange} sx={{ mb: 1 }} />
                        <TextField label="Giriş Ücreti" variant="outlined" size="small" fullWidth name="entryPrice" value={place.entryPrice} onChange={handleInputChange} sx={{ mb: 1 }} />
                        <TextField label="Kapasite" variant="outlined" size="small" fullWidth name="capacity" value={place.capacity} onChange={handleInputChange} sx={{ mb: 1 }} />
                        <TextareaAutosize minRows={3} placeholder="Açıklama" name="description" value={place.description} onChange={handleInputChange} style={{ width: "100%", marginBottom: "8px" }} />
                    </Card>
                </Stack>
            </Card>
        </Container>
    );
}
