import React, { useEffect, useState } from 'react';
import { Container, Typography, Tabs, Tab, Divider, Box, Card, CardContent, CardMedia, Button, TextField, Modal } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import TravelPlanAccordion from '../components/travel/travelPlanAccordion';
import myTravelService from '../services/myTravelService';
import placeService from '../services/placeService';
import { MyTravelPlan, Place } from '../types';
import { useAuth } from '../context/authContext';
import favoritePlaceService from '../services/favoritePlaceService';
import myTravelPlanService from '../services/myTravelPlanService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';

const TravelPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [travelPlans, setTravelPlans] = useState<any[]>([]);
    const [travel, setTravel] = useState<{ title: string; location: string; startdate: string; enddate: string } | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<Partial<Place> | null>(null);

    useEffect(() => {
        fetchMyTravelDetails();
    }, [id]);

    useEffect(() => {
        if (travel?.location) {
            fetchTravelDetails();
        }
    }, [travel]);

    useEffect(() => {
        fetchTravelDetails();
        fetchTravelPlans();
    }, [tabValue]);

    const fetchMyTravelDetails = async () => {
        try {
            if (id) {
                const data = await myTravelService.GetMyTravelById(id);
                const location = data.city ? `${data.country}, ${data.city}` : data.country;
                setTravel({ title: data.name, location, startdate: data.startDate, enddate: data.endDate });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Seyahat detayları getirilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const fetchTravelDetails = async () => {
        try {
            if (travel) {
                const [country, city] = travel.location.split(',');
                const trimmedCity = city ? city.trim() : '';
                const data = await placeService.GetPlacesByLocationWithInclude(country, trimmedCity);
                setPlaces(data);

                const favoritePlacesList: Place[] = [];
                if (user) {
                    for (const place of data) {
                        const isFavorite = await favoritePlaceService.CheckFavorite(user?.travelerId, place.id);
                        if (isFavorite) {
                            favoritePlacesList.push(place);
                        }
                    }
                }
                setFavoritePlaces(favoritePlacesList);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Seyahat detayları getirilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const fetchTravelPlans = async () => {
        try {
            if (travel && id) {
                const plans = await myTravelPlanService.GetTravelPlansByTravelId(id);
                setTravelPlans(plans);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Seyahat planları alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const removeTravelPlan = async (planId: string) => {
        try {
            await myTravelPlanService.DeleteTravelPlan(planId);
            showErrorToast("Seyahat planı çıkarıldı.");
            fetchTravelPlans();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Seyahat planı silinirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handleSaveDate = async () => {
        if (!id) {
            showErrorToast("Seyahat ID'si bulunamadı.");
            return;
        }

        if (!selectedDate || !selectedPlace) {
            showErrorToast("Lütfen bir tarih ve mekan seçin.");
            return;
        }

        if (travel?.startdate && travel?.enddate) {
            const selected = new Date(selectedDate);
            const start = new Date(travel.startdate);
            const end = new Date(travel.enddate);

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            selected.setHours(0, 0, 0, 0);

            if (selected < start || selected > end) {
                showErrorToast("Seçtiğiniz tarih, seyahat tarih aralığının dışında! Lütfen geçerli bir tarih seçin.");
                return;
            }
        }

        try {
            const existingPlan = travelPlans.find(plan => plan.placeId === selectedPlace?.id);

            if (existingPlan) {
                await myTravelPlanService.AddOrUpdateTravelPlan({
                    myTravelId: id,
                    placeId: selectedPlace.id || "",
                    date: selectedDate,
                    city: selectedPlace.city,
                    id: existingPlan?.id,
                });
                showSuccessToast("Başarıyla güncellendi.");
            }
            else {
                await myTravelPlanService.AddOrUpdateTravelPlan({
                    myTravelId: id,
                    placeId: selectedPlace.id || "",
                    date: selectedDate,
                    city: selectedPlace.city,
                });
                showSuccessToast("Başarıyla eklendi.");
            }

            setTravelPlans((prev) =>
                prev.map((plan) => (plan.id === id ? { ...plan, date: selectedDate } : plan))
            );

            showSuccessToast("Seyahat planı başarıyla kaydedildi.");
            handleCloseModal();
            fetchTravelPlans();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Tarih kaydedilirken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handlePlaceCardClick = (placeId: string) => {
        navigate(`/place/${placeId}`);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenModal = (place: Partial<Place>, existingPlan?: MyTravelPlan) => {
        setSelectedPlace(place);
        if (existingPlan) {
            const date = new Date(existingPlan.date);
            const formattedDate = date.toISOString().split('T')[0]; // 'yyyy-mm-dd' 
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate('');
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedDate('');
        setSelectedPlace(null);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}.${month}.${year}`; // "YYYY-MM-DD" → "DD.MM.YYYY"
    };

    const uniqueDates = [...new Set(travelPlans.map((plan) => plan.date))];

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {travel?.title}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography variant="body1">
                                {formatDate(travel?.startdate)} - {formatDate(travel?.enddate)}
                            </Typography>
                        </Box>
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>{travel?.location}</Typography>
                    <Divider sx={{ my: 2 }} />
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
                    <Tab label="Mekanlar" />
                    <Tab label="Favoriler" />
                    <Tab label="Seyahat Planı" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 && (
                        <Box>
                            {places.filter((place) => place.status === 1).length > 0 ? (
                                places.filter((place) => place.status === 1).map((place) => (
                                    <Card
                                        onClick={() => handlePlaceCardClick(place.id)}
                                        key={place.id}
                                        sx={{ mb: 2, display: "flex", alignItems: "center" }}>

                                        <CardMedia
                                            component="img"
                                            sx={{ width: 150, height: 100, objectFit: "cover" }}
                                            image={place.imageUrl || "https://via.placeholder.com/150"}
                                            alt={place.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h6">{place.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Kategori: {place.categoryName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Konum: {place.city}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography>Bu konumda mekan bulunmamaktadır.</Typography>
                            )}
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box>
                            {favoritePlaces.filter((place) => place.status === 1).length > 0 ? (
                                favoritePlaces.filter((place) => place.status === 1).map((place) => (
                                    <Card
                                        onClick={() => handlePlaceCardClick(place.id)}
                                        key={place.id}
                                        sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>

                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 150, height: 100, objectFit: "cover", mr: 2 }}
                                                image={place.imageUrl || "https://via.placeholder.com/150"}
                                                alt={place.name}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{place.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Kategori: {place.categoryName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Konum: {place.city}
                                                </Typography>
                                            </CardContent>
                                        </Box>

                                        <Button variant="outlined" color="success" onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenModal(place);
                                        }}>
                                            Ekle
                                        </Button>
                                    </Card>
                                ))
                            ) : (
                                <Typography>Favori mekan bulunmamaktadır.</Typography>
                            )}
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box>
                            {uniqueDates.length > 0 ? (
                                uniqueDates.map((date) => (
                                    <TravelPlanAccordion
                                        key={date}
                                        day={new Date(date).toLocaleDateString("tr-TR")}
                                        plan={travelPlans.filter((plan) => plan.date === date).map(plan => ({
                                            id: plan.id,
                                            date: plan.date,
                                            place: { name: plan.name, city: plan.city, categoryName: plan.categoryName, id: plan.placeId }
                                        }))}
                                        onDelete={removeTravelPlan}
                                        onUpdateDate={handleSaveDate}
                                        handleOpenModal={(place, existingPlan) => handleOpenModal(place, existingPlan)} />

                                ))
                            ) : (
                                <Typography>Seyahat planında herhangi bir mekan bulunmamaktadır.</Typography>
                            )}
                        </Box>
                    )}

                </Box>
            </Container>

            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
                }}>
                    <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
                        {selectedPlace?.name} için tarih seçin
                    </Typography>

                    <TextField
                        label="Tarih"
                        type="date"
                        fullWidth
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" onClick={handleCloseModal}>İptal</Button>
                        <Button variant="contained" color="primary" onClick={handleSaveDate} disabled={!selectedDate}>
                            Kaydet
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default TravelPage;
