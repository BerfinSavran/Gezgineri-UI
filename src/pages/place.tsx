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
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import ConfirmDeleteDialog from "../components/confirmDeleteDialog";
import PlaceMapViewer from "../components/PlaceMapViewer";

export default function PlacePage() {
    const [isFavorited, setIsFavorited] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState<Partial<Place> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editedPlace, setEditedPlace] = useState<Partial<Place>>({});
    const { user } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);


    const fetchPlaceDetails = async () => {
        try {
            if (id) {
                const data = await placeService.GetPlaceById(id);
                setPlace(data);
                if (data.categoryId) {
                    const categoryData = await categoryService.GetAllCategories();
                    setCategories(categoryData);
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Mekan detayları alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            if (id && user?.travelerId) {
                const isFavoritedResponse = await favoritePlaceService.CheckFavorite(user.travelerId, id);
                setIsFavorited(isFavoritedResponse);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Favori statüsü kontrol edilirken hata oluştu.";
            showErrorToast(errorMessage);
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

            await favoritePlaceService.AddOrUpdateFavoritePlace(favoritePlaceData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Favori statüsü güncellenirken hata oluştu.";
            showErrorToast(errorMessage);
            setIsFavorited(isFavorited);
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
            imageUrl: editedPlace.imageUrl || place?.imageUrl,
            status: place?.status,
            latitude: editedPlace.latitude || place?.latitude,
            longitude: editedPlace.longitude || place?.longitude,
        };

        try {
            const updatedPlace = await placeService.AddOrUpdatePlace(updatedPlaceData);
            showSuccessToast("Mekan başarıyla güncellendi");
            setPlace(updatedPlace);
            setIsEditing(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Mekan kaydedilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
        handleEditToggle();
        fetchPlaceDetails();
    };


    const handleDelete = () => {
        if (!id) {
            showErrorToast("Silinecek yerin ID'si bulunamadı.");
            return;
        }
        setOpenDialog(true); // Dialog'u açıyoruz
    };

    const handleDialogClose = () => {
        setOpenDialog(false); // Dialog'u kapatıyoruz
    };

    const handleConfirmDelete = async () => {
        setOpenDialog(false); // Dialog'u kapatıyoruz
        try {
            if (!id) {
                showErrorToast("Silinecek yerin ID'si bulunamadı.");
                return;
            }
            await placeService.DeletePlace(id); // Silme işlemi
            showSuccessToast("Mekan başarıyla silindi.");
            navigate("/home"); // Silme işlemi sonrası ana sayfaya yönlendirme
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Mekan silinirken hata oluştu.";
            showErrorToast(errorMessage);
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
            [name]:
                name === "latitude" || name === "longitude"
                    ? parseFloat(value)
                    : value,
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
                            {isEditing && editedPlace.imageUrl ? (
                                <img
                                    src={editedPlace.imageUrl}
                                    alt={place.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : place.imageUrl ? (
                                <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
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
                        <Box sx={{
                            overflowY: "auto",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            pr: 1,
                            pb: 2,
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
                                        style={{
                                            width: "100%",
                                            marginBottom: "8px",
                                            boxSizing: "border-box",
                                            resize: "vertical",
                                            minHeight: "60px"
                                        }} />
                                    <TextField
                                        label="Enlem (Latitude)"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="latitude"
                                        value={editedPlace.latitude ?? place.latitude ?? ""}
                                        onChange={handleInputChange}
                                        sx={{ mb: 1 }}
                                    />
                                    <TextField
                                        label="Boylam (Longitude)"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="longitude"
                                        value={editedPlace.longitude ?? place.longitude ?? ""}
                                        onChange={handleInputChange}
                                        sx={{ mb: 1 }}
                                    />

                                    <TextField
                                        label="Fotoğraf URL"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="imageUrl"
                                        value={editedPlace.imageUrl ?? place.imageUrl ?? ""}
                                        onChange={handleInputChange}
                                        sx={{ mb: 1 }}
                                    />

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
                        </Box>
                    </Card>

                </Stack>
            </Card>
            {!isEditing && place.latitude && place.longitude && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Harita Üzerinde Konum:
                    </Typography>
                    <PlaceMapViewer place={place as Place} />
                </Box>
            )}
            <ConfirmDeleteDialog
                open={openDialog}
                onClose={handleDialogClose}
                onConfirm={handleConfirmDelete} // Onay alındığında silme işlemi
                message="Bu mekanı silmek istediğinizden emin misiniz?"
            />
        </Container>

    );
}
