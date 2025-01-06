import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Divider, Box, Card, CardContent } from "@mui/material";
import { useLocation } from 'react-router-dom';
import TravelPlanAccordion from '../components/travel/travelPlanAccordion';
import AddLocationModal from '../components/travel/addLocationModal';

const TravelPage: React.FC = () => {
    const location = useLocation();
    // location.state'den değerleri alıyoruz, yoksa varsayılan boş değerleri kullanıyoruz
    const { title = 'Seyahat Başlığı', location: travelLocation = 'Lokasyon' } = location.state || {};

    const [tabValue, setTabValue] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<string[]>([]);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const addLocation = (location: string) => {
        setSelectedPlace((prev) => [...prev, location]); // Seçilen mekanı ekle
        handleCloseModal(); // Modalı kapat
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Typography variant="h4" sx={{ mt: 4 }}>{title}</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>{travelLocation}</Typography>
                <Divider sx={{ my: 2 }} />

                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
                    <Tab label="Mekanlar" />
                    <Tab label="Favoriler" />
                    <Tab label="Seyahat Planı" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 && (
                        <Box>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography>Mekan 1</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography>Mekan 2</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography>Favori 1</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography>Favori 2</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box>
                            {/* Burada en az bir gün için Accordion oluşturuyoruz */}
                            <TravelPlanAccordion 
                                day={1} 
                                selectedPlace={selectedPlace} // Seçilen mekanları gönder
                                handleOpenModal={handleOpenModal} 
                            /> 
                        </Box>
                    )}
                </Box>
                <AddLocationModal open={openModal} onClose={handleCloseModal} onAddLocation={addLocation} />
            </Container>
        </Container>
    );
};

export default TravelPage;
