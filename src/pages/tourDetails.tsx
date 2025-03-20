import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardMedia, CardContent, Stack, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EnumRole, TourRoute } from "../types";
import tourRouteService from "../services/tourRouteService";
import TourRouteModal from "../components/tourRouteModal"; // Modal bileşenini içeri aktar
import { useAuth } from "../context/authContext";

export default function TourDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [routes, setRoutes] = useState<TourRoute[]>([]);
    const [open, setOpen] = useState(false); // Modal açma durumu
    const [selectedRoute, setSelectedRoute] = useState<TourRoute | null>(null); // Seçili rota

    useEffect(() => {
        fetchTourRoutes();
    }, [id]);

    const isAgency = user?.role === EnumRole.Agency;

    const fetchTourRoutes = async () => {
        try {
            if (id) {
                const data = await tourRouteService.GetTourRoutesByTourId(id);
                setRoutes(data);
            }
        } catch (error) {
            console.error("Error fetching tour routes:", error);
        }
    };

    const groupedRoutes = routes.reduce((acc, route) => {
        const dateKey = new Date(route.date).toLocaleDateString("tr-TR"); // Tarihi yerel formata çeviriyoruz
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(route);
        return acc;
    }, {} as Record<string, TourRoute[]>);

    const handleEditRoute = (route: TourRoute) => {
        setSelectedRoute(route);
        setOpen(true);
    };


    const handleDelete = async (routeId: string) => {
        if (!routeId) {
            console.error("Silinecek rotanın ID'si bulunamadı.");
            return;
        }
        try {
            // doğru rota ID'sini kullanıyoruz
            await tourRouteService.DeleteTourRoute(routeId);
            alert("Rota başarıyla silindi");
            fetchTourRoutes(); // Rotaları tekrar yükleyelim
        }
        catch (error) {
            console.error("Rota silinirken hata oluştu:", error);
        }
    };


    const handleClose = () => {
        setOpen(false);
        setSelectedRoute(null);
    };

    const handleUpdateRoutes = () => {
        fetchTourRoutes();  // Modal kapandıktan sonra rotaları yeniden alıyoruz
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
                                        <CardContent>
                                            <Stack direction="row" spacing={85} alignItems="center">
                                                <Stack>
                                                    <Typography variant="h6">{route.location}</Typography>
                                                    <Typography variant="body1">{route.description}</Typography>
                                                </Stack>
                                                {isAgency &&
                                                    <Stack direction="row" spacing={1}>
                                                        <Button variant="outlined" onClick={() => handleEditRoute(route)}>Düzenle</Button>
                                                        <Button variant="outlined" color="error" onClick={() => route.id && handleDelete(route.id)}>Sil</Button>
                                                    </Stack>
                                                }
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>

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
