import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardMedia, CardContent, Stack, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EnumRole, TourRoute } from "../types";
import tourRouteService from "../services/tourRouteService";
import TourRouteModal from "../components/tourRouteModal";
import { useAuth } from "../context/authContext";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import ConfirmDeleteDialog from "../components/confirmDeleteDialog";

export default function TourDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [routes, setRoutes] = useState<TourRoute[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<TourRoute | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [routeToDeleteId, setRouteToDeleteId] = useState<string | null>(null);


    useEffect(() => {
        fetchTourRoutes();
    }, [id]);

    const isAgency = user?.role === EnumRole.Agency;

    const fetchTourRoutes = async () => {
        try {
            if (id) {
                const data = await tourRouteService.GetTourRoutesByTourId(id);
                const sortedRoutes = data.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                });
                setRoutes(sortedRoutes);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tur rotaları alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const groupedRoutes = routes.reduce((acc, route) => {
        const dateKey = new Date(route.date).toLocaleDateString("tr-TR");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(route);
        return acc;
    }, {} as Record<string, TourRoute[]>);

    const handleEditRoute = (route: TourRoute) => {
        setSelectedRoute(route);
        setOpen(true);
    };


    const handleDeleteConfirm = async () => {
        if (!routeToDeleteId) {
            showErrorToast("Silinecek rotanın ID'si bulunamadı.");
            return;
        }
        try {
            await tourRouteService.DeleteTourRoute(routeToDeleteId);
            showSuccessToast("Rota başarıyla silindi");
            fetchTourRoutes();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Rota silinirken hata oluştu.";
            showErrorToast(errorMessage);
        } finally {
            setConfirmDeleteOpen(false);
            setRouteToDeleteId(null);
        }
    };

    const askForDeleteConfirmation = (id: string) => {
        setRouteToDeleteId(id);
        setConfirmDeleteOpen(true);
    };



    const handleClose = () => {
        setOpen(false);
        setSelectedRoute(null);
    };

    const handleUpdateRoutes = () => {
        fetchTourRoutes();
    };


    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>Tur Detayları</Typography>
                {Object.entries(groupedRoutes).map(([date, locations]) => (
                    <Accordion key={date} sx={{ mb: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">{date}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                {locations.sort((a, b) => a.order - b.order).map((route) => (
                                    <Card key={route.id} sx={{ display: "flex", flexDirection: "row", border: "1px solid #ccc" }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 200, height: 150 }}
                                            image={route.imageUrl || "https://via.placeholder.com/200"}
                                            alt={route.location}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                {/* Sol: Başlık ve Açıklama */}
                                                <Stack spacing={1} sx={{ flex: 1, pr: 2 }}>
                                                    <Typography variant="h6" noWrap>{route.location}</Typography>
                                                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                        {route.description}
                                                    </Typography>
                                                </Stack>

                                                {/* Sağ: Butonlar */}
                                                {isAgency && (
                                                    <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                                                        <Button variant="outlined" onClick={() => handleEditRoute(route)}>Düzenle</Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => route.id && askForDeleteConfirmation(route.id)}
                                                        >
                                                            Sil
                                                        </Button>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </CardContent>

                                    </Card>
                                ))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>

            <ConfirmDeleteDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                message="Bu tur rotasını silmek istediğinizden emin misiniz?"
            />

            {/* Modal Bileşeni */}
            <TourRouteModal
                open={open}
                handleClose={handleClose}
                tourId={id || ""}
                initialData={selectedRoute}
                onRouteUpdated={handleUpdateRoutes} // Eğer düzenleme yapılacak bir rota varsa, onu modalda gösterelim
            />
        </Container>
    );
}
