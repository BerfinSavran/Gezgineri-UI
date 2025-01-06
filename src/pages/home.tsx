import { Container, Button, Stack, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from 'react';
import Search from '../components/search';
import { useAuth } from '../context/authContext';

export default function HomePage() {
    const { user } = useAuth();
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 3;

    const cards = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Yer İsmi ${i + 1}`,
        description: 'Burada kısa açıklama yer alacak.',
    }));

    const handleNext = () => {
        if (startIndex + itemsPerPage < cards.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const renderContent = () => {
        switch (user?.role) {
            case 1: // Traveler
                return (

                    <Stack spacing={2} alignItems="center">
                        {/* Kategori Butonları */}
                        <Stack direction="row" spacing={2}>
                            {["Otel", "Mekan", "Müze", "Tur"].map((category) => (
                                <Button key={category} variant="outlined">
                                    {category}
                                </Button>
                            ))}
                        </Stack>

                        {/* Arama Çubuğu */}
                        <Search onSearch={() => { }} />


                        {/* Mekan Kartları */}
                        <Stack spacing={2} alignItems="center" sx={{ paddingTop: 9, width: "100%" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {/* Sola kaydırma butonu */}
                                <IconButton onClick={handlePrevious} disabled={startIndex === 0}>
                                    <ArrowBackIosIcon />
                                </IconButton>

                                {/* Kartlar */}
                                <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
                                    {cards.slice(startIndex, startIndex + itemsPerPage).map((card) => (
                                        <Card key={card.id} variant="outlined" sx={{ minWidth: 400, mx: 1, minHeight: 400, border: "1px solid" }}>
                                            <CardContent>
                                                <Typography variant="h6">{card.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {card.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>

                                {/* Sağa kaydırma butonu */}
                                <IconButton onClick={handleNext} disabled={startIndex + itemsPerPage >= cards.length}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Stack>

                );
            case 2:
                return (

                    <Stack spacing={5} alignItems={"center"}>
                        <Card sx={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid",
                            padding: 2
                        }}>
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
                                    <Typography variant="h6">Turun İsmi:</Typography>
                                    <Typography variant="body1">Lokasyonu:</Typography>
                                    <Typography variant="body1">Acentanın İsmi:</Typography>
                                    <Typography variant="body1">Fiyatı:</Typography>
                                    <Typography variant="body1">Gün Sayısı:</Typography>
                                </Stack>
                            </Stack>
                        </Card>
                        <Card sx={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid",
                            padding: 2
                        }}>
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
                                    <Typography variant="h6">Turun İsmi:</Typography>
                                    <Typography variant="body1">Lokasyonu:</Typography>
                                    <Typography variant="body1">Acentanın İsmi:</Typography>
                                    <Typography variant="body1">Fiyatı:</Typography>
                                    <Typography variant="body1">Gün Sayısı:</Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>

                );
            case 3:
                return (

                    <Stack spacing={5} alignItems={"center"}>
                        <Card sx={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid",
                            padding: 2
                        }}>
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
                                    <Typography variant="h6">Mekanın İsmi:</Typography>
                                    <Typography variant="body1">Lokasyonu:</Typography>
                                    <Typography variant="body1">İşletmenin İsmi:</Typography>
                                    <Typography variant="body1">Kapasitesi:</Typography>
                                    <Typography variant="body1">Gezi Süresi:</Typography>
                                    <Typography variant="body1">Açıklama:</Typography>
                                </Stack>
                            </Stack>
                        </Card>
                        <Card sx={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid",
                            padding: 2
                        }}>
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
                                    <Typography variant="h6">Mekanın İsmi:</Typography>
                                    <Typography variant="body1">Lokasyonu:</Typography>
                                    <Typography variant="body1">İşletmenin İsmi:</Typography>
                                    <Typography variant="body1">Kapasitesi:</Typography>
                                    <Typography variant="body1">Gezi Süresi:</Typography>
                                    <Typography variant="body1">Açıklama:</Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>

                );
        }
    }

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>

                {renderContent()}

            </Container>
        </Container>
    );
}
