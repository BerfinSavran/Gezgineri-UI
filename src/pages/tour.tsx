import { Box, Button, Card, Container, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EnumRole, Tour, TourRoute } from "../types";
import { useAuth } from "../context/authContext";
import tourService from "../services/tourService";
import tourRouteService from "../services/tourRouteService";
import TourRouteModal from "../components/tourRouteModal";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import ConfirmDeleteDialog from "../components/confirmDeleteDialog";

export default function TourPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [tour, setTour] = useState<Partial<Tour> | null>(null);
    const [tourRoutes, setTourRoutes] = useState<TourRoute[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTour, setEditedTour] = useState<Partial<Tour>>({});
    const { user } = useAuth();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


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
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur detayları alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const fetchTourRoutes = async () => {
        try {
            if (id) {
                const data = await tourRouteService.GetTourRoutesByTourId(id);
                setTourRoutes(data);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur rotaları alınırken hata oluştu.";
            showErrorToast(errorMessage);
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
        const startDate = editedTour.startDate || tour?.startDate;
        const endDate = editedTour.endDate || tour?.endDate;

        if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (startDateObj > endDateObj) {
                showErrorToast("Başlangıç tarihi, bitiş tarihinden sonra olamaz.");
                return;
            }

            if (endDateObj < startDateObj) {
                showErrorToast("Bitiş tarihi, başlangıç tarihinden önce olamaz.");
                return;
            }
        }

        const updatedTourData: Partial<Tour> = {
            ...editedTour,
            id: id,
            agencyId: tour?.agencyId,
            name: tour?.name,
            startDate: editedTour.startDate || tour?.startDate,
            endDate: editedTour.endDate || tour?.endDate,
            price: editedTour.price || tour?.price,
            capacity: editedTour.capacity || tour?.capacity,
            description: editedTour.description || tour?.description,
            imageUrl: editedTour.imageUrl || tour?.imageUrl,
            webSiteUrl: tour?.webSiteUrl,
            status: tour?.status,
        };


        try {
            const updatedTour = await tourService.AddOrUpdateTour(updatedTourData);
            showSuccessToast("Tur başarıyla güncellendi.");
            setTour(updatedTour);
            setIsEditing(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur güncellenirken hata oluştu.";
            showErrorToast(errorMessage);
        }
        handleEditToggle();
        fetchTourDetails();
    };


    const handleDelete = async () => {
        if (!id) {
            showErrorToast("Silinecek turun ID'si bulunamadı.");
            return;
        }
        try {
            await tourService.DeleteTour(id);
            showSuccessToast("Başarıyla silindi.");
            navigate("/home");
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur silinirken hata oluştu.";
            showErrorToast(errorMessage);
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
                                    <Button
                                        variant="outlined"
                                        sx={{ mr: "15px", mt: "10px" }}
                                        onClick={() => setConfirmDeleteOpen(true)}
                                    >
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
                            {isEditing && editedTour.imageUrl ? (
                                <img
                                    src={editedTour.imageUrl}
                                    alt={tour.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : tour.imageUrl ? (
                                <img
                                    src={tour.imageUrl}
                                    alt={tour.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
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
                                        label="Tur Adı"
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
                                        style={{
                                            width: "100%",
                                            marginBottom: "8px",
                                            boxSizing: "border-box",
                                            resize: "vertical",
                                            minHeight: "60px"
                                        }}
                                    />
                                    <TextField
                                        label="Görsel URL"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="imageUrl"
                                        value={editedTour.imageUrl ?? tour.imageUrl ?? ""}
                                        onChange={handleInputChange}
                                        sx={{ mb: 1 }}
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
                                    {tour.webSiteUrl && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Web Sitesi:</Typography>
                                            <a href={tour.webSiteUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1976d2" }}>
                                                {tour.webSiteUrl}
                                            </a>
                                        </Stack>
                                    )}

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
                        </Box>
                    </Card>
                </Stack>
            </Card>
            <TourRouteModal open={modalOpen} handleClose={handleCloseModal} tourId={tour.id ?? ""} />
            <ConfirmDeleteDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                message={"Bu turu silmek istediğinizden emin misiniz ?"}
            />

        </Container>
    )
}