import { Box, Card, Container, IconButton, Stack, Typography } from "@mui/material";


export default function TourPage() {


    return (
        <Container maxWidth="xl">
            <Card sx={{ minHeight: "550px", mt: 15, border: "1px solid" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ ml: "20px", mt: "10px" }}>Turun Adı</Typography>
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Acentanın Adı:</Typography>
                            <Typography variant="body1">[Acentanın Adı]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Tarihleri:</Typography>
                            <Typography variant="body1">[Tarihleri]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Kapasitesi:</Typography>
                            <Typography variant="body1">[Kapasitesi]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Fiyatı:</Typography>
                            <Typography variant="body1">[Fiyatı]</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Detay:</Typography>
                            <Typography variant="body1">[Detaylı Bilgi]</Typography>
                        </Stack>
                    </Card>
                </Stack>
            </Card>
        </Container>
    )
}