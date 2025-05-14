import { Container, Card, Stack, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import NewTravelDialog from "../components/travel/newTravelDialog";
import { useNavigate } from "react-router-dom";
import myTravelService from "../services/myTravelService";
import { MyTravel } from "../types";
import { useAuth } from "../context/authContext";
import ConfirmDeleteDialog from "../components/confirmDeleteDialog";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function MyTravelPage() {
    const { user } = useAuth();
    const [myTravels, setMyTravels] = useState<MyTravel[]>([]);
    const [dialogTravel, setDialogTravel] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTravelId, setSelectedTravelId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyTravels();
    }, [user?.travelerId]);

    const fetchMyTravels = async () => {
        try {
            if (!user?.travelerId) return;
            const data = await myTravelService.GetMyTravelsByTravelerId(user?.travelerId);
            setMyTravels(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Seyahatler getirilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handleTravelClick = (mytravel: MyTravel) => {
        navigate(`/travel/${mytravel.id}`);
    };

    const handleTravelAdded = () => {
        fetchMyTravels();
    };

    const handleDeleteDialogOpen = (travelId: string) => {
        setSelectedTravelId(travelId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setSelectedTravelId(null);
    };

    const handleTravelDelete = async () => {
        if (selectedTravelId) {
            try {
                await myTravelService.DeleteMyTravel(selectedTravelId);
                showSuccessToast("Seyahat başarıyla silindi.");
                fetchMyTravels();
                handleDeleteDialogClose();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Seyahat silinirken hata oluştu.";
                showErrorToast(errorMessage);
            }
        }
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack spacing={3}>
                    {/* Yeni Seyahat Butonu */}
                    <Card
                        onClick={() => setDialogTravel(true)}
                        sx={{ padding: 2, display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                        <AddIcon fontSize="large" />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Yeni Seyahat Oluşturun
                        </Typography>
                    </Card>

                    <NewTravelDialog open={dialogTravel} onClose={() => setDialogTravel(false)} onTravelAdded={handleTravelAdded} />

                    {/* Divider */}
                    <div style={{ borderBottom: "1px solid gray", marginTop: "20px" }} />

                    {/* Seyahatlerim Başlığı */}
                    <Typography variant="h5">Seyahatlerim</Typography>

                    {/* Seyahat Kartları */}
                    <Stack spacing={2}>
                        {myTravels.map((mytravel) => (
                            <Card
                                key={mytravel.id}
                                sx={{
                                    padding: 3,
                                    border: "1px solid gray",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h6" onClick={() => handleTravelClick(mytravel)}>
                                    {mytravel.name}
                                </Typography>

                                {/* Butonlar */}
                                <Stack direction="row" spacing={1}>
                                    {/* Gör Butonu */}
                                    <IconButton
                                        onClick={() => handleTravelClick(mytravel)}
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>

                                    {/* Sil Butonu */}
                                    <IconButton
                                        onClick={() => handleDeleteDialogOpen(mytravel.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </Container>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                onConfirm={handleTravelDelete}
                message="Bu seyahati silmek istediğinizden emin misiniz?"
            />
        </Container>
    );
}
