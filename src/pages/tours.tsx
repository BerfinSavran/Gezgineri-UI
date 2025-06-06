import { Card, Container, Stack, Typography } from "@mui/material";
import Search from "../components/search";
import { useEffect, useState } from "react";
import { Tour } from "../types";
import tourService from "../services/tourService";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../utils/toastHelper";

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTours();
    }, [user?.travelerId]);

    const fetchTours = async () => {
        try {
            const data = await tourService.GetToursStartingFromToday();
            const approvedTours = data.filter((tour: Tour) => tour.status === 1);
            setTours(approvedTours);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Turlar alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    }

    const handleTourClick = (tourId: string) => {
        navigate(`/tour/id/${tourId}`);
    }

    const formatDateForTypography = (dateString: string | undefined) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}.${month}.${year}`; // "YYYY-MM-DD" → "DD.MM.YYYY"
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        const filtered = tours.filter((tour) =>
            tour.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTours(filtered);
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack spacing={5} alignItems={"center"}>
                    <Search onSearch={handleSearchChange} />
                    {searchQuery.trim() ?
                        filteredTours.map((tour) => (
                            <Card
                                key={tour.id}
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    border: "1px solid",
                                    padding: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    overflow: 'hidden',
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
                                        {tour.imageUrl ? (
                                            <img
                                                src={tour.imageUrl}
                                                alt={tour.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            "Fotoğraf"
                                        )}
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
                        )) : tours.map((tour) => (
                            <Card
                                key={tour.id}
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    border: "1px solid",
                                    padding: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    overflow: 'hidden',
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
                                        {tour.imageUrl ? (
                                            <img
                                                src={tour.imageUrl}
                                                alt={tour.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            "Fotoğraf"
                                        )}
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
                        ))
                    }
                </Stack>
            </Container>
        </Container>
    );
}
