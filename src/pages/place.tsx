import { useState } from "react";
import { Box, Card, Container, IconButton, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PlacePage() {
    // State to track if the place is favorited
    const [isFavorited, setIsFavorited] = useState(false);

    // Toggle favorite state on icon click
    const handleFavoriteToggle = () => {
        setIsFavorited(!isFavorited);
    };

    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>Mekanın Adı</Typography>
                    <Box>
                        <IconButton sx={{ mr: "15px", mt: "10px" }} onClick={handleFavoriteToggle}>
                            {isFavorited ? (
                                <FavoriteIcon sx={{ fontSize: "30px", color: "red" }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: "30px" }} />
                            )}
                        </IconButton>
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
                            Fotoğraf
                        </Card>
                        <Typography variant="body1" sx={{ mt: "20px" }}>Lokasyon Bilgisi</Typography>
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
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>İşletmenin Adı:</Typography>
                            <Typography variant="body1">[İşletme Adı]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Çalışma Aralığı:</Typography>
                            <Typography variant="body1">[Çalışma Saatleri]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Kategorisi:</Typography>
                            <Typography variant="body1">[Kategori Bilgisi]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Detay:</Typography>
                            <Typography variant="body1">[Detaylı Bilgi]</Typography>
                        </Stack>
                    </Card>
                </Stack>
            </Card>
        </Container>
    );
}
