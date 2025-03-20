import { useEffect, useState } from "react";
import { Box, Card, Container, IconButton, Stack, Typography, Button, TextField, TextareaAutosize, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useParams } from "react-router-dom";
import { Category, EnumRole, FavoritePlace, Place } from "../types";
import placeService from "../services/placeService";
import { useAuth } from "../context/authContext";
import favoritePlaceService from "../services/favoritePlaceService";
import categoryService from "../services/categoryService";

export default function PlacePage() {
    const [isFavorited, setIsFavorited] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState<Partial<Place> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]); // Kategoriler için state ekledik
    const [editedPlace, setEditedPlace] = useState<Partial<Place>>({});
    const { user } = useAuth();

    const fetchPlaceDetails = async () => {
        try {
            if (id) {
                const data = await placeService.GetPlaceById(id);
                setPlace(data);
                if (data.categoryId) {
                    // Veritabanından kategori bilgisini alabiliriz
                    const categoryData = await categoryService.GetAllCategories();
                    setCategories(categoryData); 
                }
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            if (id && user?.travelerId) {
                const isFavoritedResponse = await favoritePlaceService.CheckFavorite(user.travelerId, id);
                setIsFavorited(isFavoritedResponse);
            }
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            if (!id || !user?.travelerId) return;

            const newFavoriteStatus = !isFavorited;
            setIsFavorited(newFavoriteStatus);

            const favoritePlaceData: Partial<FavoritePlace> = {
                placeid: id,
                travelerid: user.travelerId,
                isFavorite: newFavoriteStatus
            };

            // Favoriyi ekleme veya kaldırma işlemi için aynı metot kullanılacak
            await favoritePlaceService.AddOrUpdateFavoritePlace(favoritePlaceData);
        } catch (error) {
            console.error("Error updating favorite status:", error);
            setIsFavorited(isFavorited); // Hata olursa state'i eski haline getir
        }
    };


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedPlace({});
    };

    const handleSaveChanges = async () => {
        const updatedPlaceData: Partial<Place> = {
            ...editedPlace,
            id: id,
            ownerId: place?.ownerId,
            name: editedPlace.name || place?.name,
            visitDuration: editedPlace.visitDuration || place?.visitDuration,
            categoryId: editedPlace.categoryId || place?.categoryId,
            entryPrice: editedPlace.entryPrice || place?.entryPrice,
            capacity: editedPlace.capacity || place?.capacity,
            description: editedPlace.description || place?.description,
            country: editedPlace.country || place?.country,
            city: editedPlace.city || place?.city,
        };

        try {
            const updatedPlace = await placeService.AddOrUpdatePlace(updatedPlaceData);
            setPlace(updatedPlace);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving place changes:", error);
        }
        handleEditToggle();
        fetchPlaceDetails();
    };

    const handleDelete = async () => {
        if (!id) {
            console.error("Silinecek yerin ID'si bulunamadı.");
            return;
        }
        try {
            await placeService.DeletePlace(id);
            alert("Deleted successfully");
            navigate("/home");
        }
        catch (error) {
            console.error("Error deleting place:", error);
        }
    };


    useEffect(() => {
        fetchPlaceDetails();
        checkFavoriteStatus();
    }, [id]);

    if (!place) return <p>Yükleniyor...</p>;

    const isOwner = user?.role === EnumRole.Owner;
    const isTraveler = user?.role === EnumRole.Traveler;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEditedPlace((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
            setPlace((prev) => ({ ...prev, categoryId: event.target.value }));
        };

    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>{place.name}</Typography>
                    <Box>
                        {isTraveler && (
                            <IconButton sx={{ mr: "15px", mt: "10px" }} onClick={handleFavoriteToggle}>
                                {isFavorited ? (
                                    <FavoriteIcon sx={{ fontSize: "30px", color: "red" }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ fontSize: "30px" }} />
                                )}
                            </IconButton>
                        )}
                        {isOwner && (
                            isEditing ?
                                <Stack direction="row">
                                    <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleSaveChanges}>
                                        {'Kaydet'}
                                    </Button>
                                    <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleCancelEdit}>
                                        {'İptal'}
                                    </Button>
                                </Stack>

                                :
                                <Stack direction={"row"}>
                                    <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleEditToggle}>
                                        {'Düzenle'}
                                    </Button>
                                    <Button variant="outlined" sx={{ mr: "15px", mt: "10px" }} onClick={handleDelete}>
                                        {"Sil"}
                                    </Button>

                                </Stack>
                        )}
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
                            {place.imageUrl ? (
                                <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "100%" }} />
                            ) : "Fotoğraf"}
                        </Card>
                        <Typography variant="body1" sx={{ mt: "20px" }}>Lokasyon: {place.country + ", " + place.city}</Typography>
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
                        {isEditing ? (
                            <>
                                <TextField
                                    label="Mekan Adı"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="name"
                                    value={editedPlace.name ?? place.name ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Gezi Süresi"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="visitDuration"
                                    value={editedPlace.visitDuration ?? place.visitDuration ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <Select
                                    labelId="category-label"
                                    label="Kategorisi"
                                    name="categoryId"
                                    value={editedPlace.categoryId ?? place.categoryId ?? ""}
                                    onChange={handleCategoryChange}
                                    displayEmpty
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    label="Giriş Ücreti"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="entryPrice"
                                    value={editedPlace.entryPrice ?? place.entryPrice ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Kapasitesi"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="capacity"
                                    value={editedPlace.capacity ?? place.capacity ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Lokasyon"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="country"
                                    value={editedPlace.country ?? place.country ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Şehir"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="city"
                                    value={editedPlace.city ?? place.city ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextareaAutosize
                                    minRows={3}
                                    placeholder="Açıklama"
                                    name="description"
                                    value={editedPlace.description ?? place.description ?? ""}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", marginBottom: "8px" }} />
                            </>
                        ) : (
                            <>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>İşletmenin Adı:</Typography>
                                    <Typography variant="body1">{place.businessName}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Gezi Süresi: </Typography>
                                    <Typography variant="body1">{place.visitDuration}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Kategorisi:</Typography>
                                    <Typography variant="body1">{place.categoryName}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Giriş Ücreti:</Typography>
                                    <Typography variant="body1">{place.entryPrice}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Kapasitesi:</Typography>
                                    <Typography variant="body1">{place.capacity}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Açıklama:</Typography>
                                    <Typography variant="body1">{place.description}</Typography>
                                </Stack>
                            </>
                        )}
                    </Card>

                </Stack>
            </Card>
        </Container>
    );
}
