import { Button, Card, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/authContext";
import { EnumRole } from "../types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async () => {
    try {
      const data = await authService.login(email, password);
      alert("Login success");

      setToken(data.token);
      await redirectAfterLogin(data.token, navigate);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Please try again.");
    }
  };

  async function redirectAfterLogin(token: string, navigate: any) {
    try {
      const decoded = await authService.decodeToken(token);
  
      if (decoded.role === EnumRole.Admin) {
        navigate("/adminDashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      navigate("/home"); // Hata olursa varsayılan olarak /home
    }
  }

  return (
    <Container maxWidth="xl">
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card sx={{ padding: "20px", width: "400px" }}>
          <Stack direction={"column"} alignItems={"center"}>
            <Typography variant="h4" sx={{ padding: "50px" }}>Gezgineri</Typography>
            <Stack direction={"row"} spacing={2} alignItems="center" sx={{ marginBottom: "20px" }}>
              <Typography variant="h6" sx={{ width: "100px" }}>E-mail:</Typography>
              <TextField 
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </Stack>
            <Stack direction={"row"} spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ width: "100px" }}>Şifre:</Typography>
              <TextField 
                type="password" 
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
            <Button sx={{
              backgroundColor: "blue",
              color: "white",
              width: "160px",
              marginTop: "35px"
            }} onClick={handleLoginSubmit}>Giriş Yap</Button>
            <Typography variant="body2" sx={{ marginTop: "5px" }}>
              Kaydınız yok mu?{" "}
              <Link to={"/register"} style={{ textDecoration: 'none', color: 'blue' }}>Hemen kayıt olun.</Link>
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Container>
  );
}
