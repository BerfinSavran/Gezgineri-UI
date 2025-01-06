import { Card, Container, Stack, Typography } from "@mui/material";
import Search from "../components/search";

export default function ToursPage() {


    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack spacing={5} alignItems={"center"}>
                    <Search onSearch={()=>{}}/>
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
            </Container>
        </Container>
    );
}
