import { Container, Card, Stack, Typography, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import NewTravelDialog from "../components/travel/newTravelDialog";
import { useNavigate } from "react-router-dom";

export default function MyTravelPage() {
    const [dialogTravel, setDialogTravel] = useState(false);
    const navigate = useNavigate();

    const handleTravelClick = () => {
        navigate('/travel', { state: { title: "Seyahat Başlığı", location: "Lokasyon" } });
    };

    const handleOpenDialog = () => {
        setDialogTravel(true);
    }

    const handleCloseDialog = () => {
        setDialogTravel(false);
    }

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack spacing={3}>

                    <Card onClick={handleOpenDialog} sx={{ padding: 2, display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                        <AddIcon fontSize="large" />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Yeni Seyahat Oluşturun
                        </Typography>
                    </Card>

                    <NewTravelDialog open={dialogTravel} onClose={handleCloseDialog} />
                    
                    {/* Divider */}
                    <div style={{ borderBottom: "1px solid gray", marginTop:"20px"}} />

                    {/* Seyahatlerim Başlığı */}
                    <Typography variant="h5">
                        Seyahatlerim
                    </Typography>

                    {/* Seyahat Kartları */}
                    <Card onClick={handleTravelClick} sx={{ padding: 3, border: "1px solid gray" }}>
                        <Typography variant="h6">Seyahat Başlığı1</Typography>
                    </Card>
                    <Card  onClick={handleTravelClick} sx={{ padding: 3, border: "1px solid gray" }}>
                        <Typography variant="h6">Seyahat Başlığı2</Typography>
                    </Card>
                    {/* İstediğiniz kadar seyahat kartı ekleyebilirsiniz */}
                </Stack>
            </Container>
        </Container>
    );
}
