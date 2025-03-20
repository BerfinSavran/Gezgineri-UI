import { Card, Container, Stack, Typography } from "@mui/material";
import Search from "../components/search";
import { useEffect, useState } from "react";
import { Tour } from "../types";
import tourService from "../services/tourService";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTours();
    }, [user?.travelerId]);

    const fetchTours = async () => {
        try {
            const data = await tourService.GetToursStartingFromToday();
            setTours(data);
        } catch (error) {
            console.error("Error fetching tours:", error);
            alert("Error fetching tours.");
        }
    }

    const handleTourClick = (tourId: string) => {
        navigate(`/tour/id/${tourId}`);  // ID'yi kullanarak ilgili tura yönlendirme yap
    }

    const formatDateForTypography = (dateString: string | undefined) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}.${month}.${year}`; // "YYYY-MM-DD" → "DD.MM.YYYY"
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack spacing={5} alignItems={"center"}>
                    <Search onSearch={() => { }} />
                    {tours.map((tour) => (
                        <Card
                            key={tour.id}
                            sx={{
                                width: "100%",
                                height: "200px",
                                border: "1px solid",
                                padding: 2
                            }}
                            onClick={() => handleTourClick(tour.id)}
                        >
                            <Stack direction={"row"} spacing={2}>
                                <Card sx={{
                                    width: "300px",
                                    height: "190px",
                                    border: "1px solid",
                                    color: "gray",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",

                                }}>
                                    Fotoğraf
                                </Card>
                                <Stack direction={"column"} spacing={"8px"}>
                                    <Typography variant="h6">Turun İsmi: {tour.name}</Typography>
                                    <Typography variant="body1">Acentanın İsmi: {tour.companyName} </Typography>
                                    <Typography variant="body1">Fiyatı: {tour.price}</Typography>
                                    <Typography variant="body1">Kapasitesi: {tour.capacity} </Typography>
                                    <Typography variant="body1">Başlangıç Tarihi: {formatDateForTypography(tour.startDate)}</Typography>
                                    <Typography variant="body1">Bitiş Tarihi: {formatDateForTypography(tour.endDate)}</Typography>
                                    <Typography variant="body1">Açıklaması: {tour.description} </Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}

                </Stack>
            </Container>
        </Container>
    );
}
