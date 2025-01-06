import { Button, Card, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async () => {
        try {
            const data = await authService.login(email, password);  // Asenkron işlem await ile bekleniyor
            alert("Login success");
            // Başarılı giriş sonrası user'ı AuthContext'e kaydedin
            setUser(data);  // authService'den dönen member bilgisi set ediliyor
            console.log(data);
            navigate("/home");  // Login başarılıysa ana sayfaya yönlendirme
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed! Please try again.");  // Hata mesajı
        }
    };


    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Card sx={{
                    padding: "20px",
                    width: "400px"
                }}>
                    <Stack direction={"column"} alignItems={"center"}>
                        <Typography variant="h4" sx={{
                            padding: "50px"
                        }}>Gezgineri</Typography>
                        <Stack direction={"row"} spacing={2} alignItems="center" sx={{marginBottom: "20px"}}>
                            <Typography variant="h6" sx={{ width: "100px" }}>E-mail:</Typography>
                            <TextField 
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            ></TextField>
                        </Stack>
                        <Stack direction={"row"} spacing={2} alignItems="center">
                            <Typography variant="h6" sx={{ width: "100px" }}>Şifre:</Typography>
                            <TextField 
                                type="password" 
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></TextField>
                        </Stack>
                        <Button sx={{
                            backgroundColor: "blue",
                            color: "white",
                            width: "160px",
                            marginTop: "35px"
                        }}
                            onClick={handleLoginSubmit}
                        >Giriş Yap</Button>
                        <Typography variant="body2" sx={{marginTop: "5px"}}>Kaydınız yok mu?{""}
                            <Link to={"/register"} style={{ textDecoration: 'none', color: 'blue' }} > Hemen kayıt olun.</Link>
                        </Typography>
                    </Stack>
                </Card>
            </Container>
        </Container>
    );
}
