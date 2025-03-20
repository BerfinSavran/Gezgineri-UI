import { Box, Button, Card, Container, IconButton, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EnumRole, Tour, TourRoute } from "../types";
import { useAuth } from "../context/authContext";
import tourService from "../services/tourService";
import tourRouteService from "../services/tourRouteService";
import TourRouteModal from "../components/tourRouteModal";


export default function TourPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [tour, setTour] = useState<Partial<Tour> | null>(null);
    const [tourRoutes, setTourRoutes] = useState<TourRoute[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTour, setEditedTour] = useState<Partial<Tour>>({});
    const { user } = useAuth();

    useEffect(() => {
        fetchTourDetails();
        fetchTourRoutes();
    }, [id]);

    const fetchTourDetails = async () => {
        try {
            if (id) {
                const data = await tourService.GetTourByIdWithInclude(id);
                setTour(data);
            }
        } catch (error) {
            console.error("Error fetching tour details:", error);
        }
    };

    const fetchTourRoutes = async () => {
        try {
            if (id) {
                const data = await tourRouteService.GetTourRoutesByTourId(id);
                setTourRoutes(data);
            }
        } catch (error) {
            console.error("Error fetching tour routes:", error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTour({});
    };

    const handleSaveChanges = async () => {
        const updatedTourData: Partial<Tour> = {
            ...editedTour,
            id: id,
            agencyId: tour?.agencyId,
            name: editedTour.name || tour?.name,
            startDate: editedTour.startDate || tour?.startDate,
            endDate: editedTour.endDate || tour?.endDate,
            price: editedTour.price || tour?.price,
            capacity: editedTour.capacity || tour?.capacity,
            description: editedTour.description || tour?.description,
        };

        try {
            const updatedTour = await tourService.AddOrUpdateTour(updatedTourData);
            setTour(updatedTour);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving tour changes:", error);
        }
        handleEditToggle();
        fetchTourDetails();
    };

    const handleDelete = async () => {
        if (!id) {
            console.error("Silinecek turun ID'si bulunamadı.");
            return;
        }
        try {
            await tourService.DeleteTour(id);
            alert("Deleted successfully");
            navigate("/home");
        }
        catch (error) {
            console.error("Error deleting tour:", error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "startDate" || name === "endDate") {
            setEditedTour((prevState) => ({
                ...prevState,
                [name]: value, // "YYYY-MM-DD" olarak sakla
            }));
            return;
        }

        setEditedTour((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        return dateString.split("T")[0]; // "YYYY-MM-DDTHH:mm:ss" → "YYYY-MM-DD"
    };

    const formatDateForTypography = (dateString: string | undefined) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}.${month}.${year}`; // "YYYY-MM-DD" → "DD.MM.YYYY"
    };


    const locationList = tourRoutes.map((route) => route.location).join(", ");

    if (!tour) return <p>Yükleniyor...</p>;

    const isAgency = user?.role === EnumRole.Agency;

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>{tour.name}</Typography>
                    <Box>
                        {isAgency && (
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
                            {tour.imageUrl ? (
                                <img src={tour.imageUrl} alt={tour.name} style={{ width: "100%", height: "100%" }} />
                            ) : "Fotoğraf"}
                        </Card>
                        <Typography variant="body1" sx={{ mt: "20px" }}>Lokasyonlar: {locationList} </Typography>

                    </Stack>

                    <Card sx={{
                        width: "800px",
                        height: "400px",
                        border: "1px solid",
                        mr: "23px", mt: "10px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                    }}>
                        {isEditing ? (
                            <>
                                <TextField
                                    label="Acenta Adı"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="name"
                                    value={editedTour.name ?? tour.name ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Başlangıç Tarihi"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="startDate"
                                    type="date"
                                    value={formatDate(editedTour.startDate ?? tour.startDate)}
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
                                    value={formatDate(editedTour.endDate ?? tour.endDate)}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Tur Ücreti"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="price"
                                    value={editedTour.price ?? tour.price ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Kapasitesi"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="capacity"
                                    value={editedTour.capacity ?? tour.capacity ?? ""}
                                    onChange={handleInputChange}
                                    sx={{ mb: 1 }}
                                />
                                <TextareaAutosize
                                    minRows={3}
                                    placeholder="Açıklama"
                                    name="description"
                                    value={editedTour.description ?? tour.description ?? ""}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", marginBottom: "8px" }}
                                />
                                
                            </>
                        ) : (
                            <>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Acentanın Adı:</Typography>
                                    <Typography variant="body1">{tour.companyName}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Başlangıç Tarihi:</Typography>
                                    <Typography variant="body1">{formatDateForTypography(tour.startDate)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Bitiş Tarihi:</Typography>
                                    <Typography variant="body1">{formatDateForTypography(tour.endDate)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Kapasitesi:</Typography>
                                    <Typography variant="body1">{tour.capacity}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Fiyatı:</Typography>
                                    <Typography variant="body1">{tour.price}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Açıklaması:</Typography>
                                    <Typography variant="body1">{tour.description}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Button
                                        variant="outlined"
                                        sx={{ mt: "10px" }}
                                        onClick={() => navigate(`/tourDetails/${id}`)}
                                    >
                                        Detayları Gör
                                    </Button>
                                    {isAgency &&
                                        <Button variant="outlined" onClick={handleOpenModal}>Tur Rotası Ekle</Button>
                                    }

                                </Stack>
                            </>
                        )}
                    </Card>
                </Stack>
            </Card>
            <TourRouteModal open={modalOpen} handleClose={handleCloseModal} tourId={tour.id ?? ""}/>
        </Container>
    )
}