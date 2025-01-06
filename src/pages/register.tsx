import { Container, Stack } from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RoleCard from "../components/register/roleCard";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import { useState } from "react";
import RoleDialog from "../components/register/roleDialog";
import travelerService from "../services/travelerService";
import { Agency, Owner, Traveler } from "../types";
import { useNavigate } from "react-router-dom";
import agencyService from "../services/agencyService";
import ownerService from "../services/ownerService";

export default function RegisterPage() {
    const [dialogRole, setDialogRole] = useState("");
    const navigate = useNavigate();

    const handleOpenDialog = (role: string) => {
        setDialogRole(role);
    }

    const handleCloseDialog = () => {
        setDialogRole("");
    }

    const handleFormSubmit = async (formValues: Record<string, string>) => {
        try {
            if (dialogRole == "traveler") {
                const travelerData: Partial<Traveler> = {
                    fullName: formValues["Ad Soyad"],
                    email: formValues["Email"],
                    password: formValues["Şifre"],
                };
                await travelerService.CreateTraveler(travelerData);
                alert("Traveler registered successfully!");
                navigate("/");
            }
            else if (dialogRole === "agency") {
                const agencyData: Partial<Agency> = {
                    fullName: formValues["Ad Soyad"],
                    companyName: formValues["Şirket İsmi"],
                    email: formValues["Email"],
                    password: formValues["Şifre"],
                    taxNumber: formValues["Vergi Numarası"],
                    licenseNumber: formValues["Lisans Numarası"],
                };
                await agencyService.CreateAgency(agencyData);
                alert("Agency registered successfully!");
                navigate("/");
            } 
            else if (dialogRole === "owner") {
                const ownerData: Partial<Owner> = {
                    fullName: formValues["Ad Soyad"],
                    businessName: formValues["İşletme Adı"],
                    email: formValues["Email"],
                    password: formValues["Şifre"],
                    phoneNumber: formValues["Telefon"],
                    licenseNumber: formValues["Lisans Numarası"],
                };
                await ownerService.CreateOwner(ownerData);
                alert("Owner registered successfully!");
                navigate("/");
            }
            handleCloseDialog();
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    const roleForms: Record<string, { label: string; type?: string }[]> = {
        traveler: [
            { label: "Ad Soyad" },
            { label: "Email" }, 
            { label: "Şifre", type: "password" }
        ],
        agency: [
            { label: "Ad Soyad" },
            { label: "Şirket İsmi" },
            { label: "Email" }, 
            { label: "Şifre", type: "password" },
            { label: "Vergi Numarası" },
            { label: "Lisans Numarası" },
        ],
        owner: [
            { label: "Ad Soyad" },
            { label: "İşletme Adı" },
            { label: "Email" },
            { label: "Şifre", type: "password" },
            { label: "Telefon" },
            { label: "Lisans Numarası" },

        ],
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <Stack direction={"row"} justifyContent={"center"} padding={"50px"} spacing={"40px"}>
                    <RoleCard title="Gezgin" onClick={() => handleOpenDialog("traveler")}>
                        <DirectionsRunIcon sx={{ fontSize: "45px" }} />
                    </RoleCard>
                    <RoleCard title="Seyahat Acentası" onClick={() => handleOpenDialog("agency")}>
                        <CardTravelIcon sx={{ fontSize: "45px" }} />
                    </RoleCard>
                    <RoleCard title="İşletme Sahibi" onClick={() => handleOpenDialog("owner")}>
                        <NightShelterIcon sx={{ fontSize: "45px" }} />
                    </RoleCard>
                </Stack>
            </Container>

            {dialogRole && (
                <RoleDialog
                    open={Boolean(dialogRole)}
                    onClose={handleCloseDialog}
                    title={dialogRole}
                    formFields={roleForms[dialogRole]}
                    onSubmit={handleFormSubmit}
                />
            )}
        </Container>
    )
}
