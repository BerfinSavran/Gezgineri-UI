import React, { useEffect, useState } from 'react';
import { Container, Typography, Stack, Avatar, Button, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { EnumGender, EnumRole } from '../types';
import travelerService from '../services/travelerService';
import agencyService from '../services/agencyService';
import ownerService from '../services/ownerService';
import { useAuth } from '../context/authContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [travelerId, setTravelerId] = useState<string | null>(null);
    const [roleName, setRoleName] = useState("");
    const [gender, setGender] = useState<EnumGender>();
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (user) {
            fetchUserData(user);
        }
        editProps();
    }, [user]);

    useEffect(() => {
        const savedGender = localStorage.getItem('gender');
        if (savedGender) {
            setGender(savedGender === '0' ? EnumGender.Male : EnumGender.Female);
        }
    }, []);

    const fetchUserData = async (decodedUser: any) => {
        try {
            let userData = null;
            switch (decodedUser.role) {
                case EnumRole.Traveler:
                    userData = await travelerService.GetTravelerByMemberId(decodedUser.id);
                    setTravelerId(userData.id);
                    break;
                case EnumRole.Agency:
                    userData = await agencyService.GetAgencyByMemberId(decodedUser.id);
                    setAgencyId(userData.id);
                    break;
                case EnumRole.Owner:
                    userData = await ownerService.GetOwnerByMemberId(decodedUser.id);
                    setOwnerId(userData.id);
                    break;
                default:
                    console.error('Unknown role');
                    return;
            }
            setFormData(userData);
            if (userData.gender !== undefined) {
                localStorage.setItem('gender', userData.gender === 0 ? '0' : '1');
            }
        } catch (err) {
            console.error('Error fetching user data', err);
        }
    };

    const handleEditClick = () => setIsEditing(true);

    const handleSaveClick = async () => {
        try {
            let updatedData = { ...formData };

            updatedData.gender = gender === EnumGender.Male ? 0 : 1;

            switch (user?.role) {
                case EnumRole.Traveler:
                    if (!travelerId) {
                        console.error("Traveler ID bulunamadı!");
                        return;
                    }
                    updatedData = { ...updatedData, id: travelerId };
                    await travelerService.UpdateTraveler(updatedData);
                    break;

                case EnumRole.Agency:
                    if (!agencyId) {
                        console.error("Agency ID bulunamadı!");
                        return;
                    }
                    updatedData = { ...updatedData, id: agencyId }; // Agency ID ekle
                    await agencyService.UpdateAgency(updatedData);
                    break;

                case EnumRole.Owner:
                    if (!ownerId) {
                        console.error("Owner ID bulunamadı!");
                        return;
                    }
                    updatedData = { ...updatedData, id: ownerId }; // Owner ID ekle
                    await ownerService.UpdateOwner(updatedData);
                    break;

                default:
                    console.error("Bilinmeyen rol, güncelleme yapılamadı!");
                    return;
            }
            setFormData(updatedData);
            localStorage.setItem('gender', updatedData.gender === 0 ? '0' : '1');
            setIsEditing(false);
            //alert("Bilgiler başarıyla güncellendi!");
        } catch (error) {
            console.error("Güncelleme sırasında hata oluştu:", error);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: any) => ({
            ...(prevData ?? {}),
            [name]: value
        }));
    };

    const handleGenderChange = (e: SelectChangeEvent<EnumGender>) => {
        const selectedGender = e.target.value as EnumGender;
        setGender(selectedGender);  // State'i güncelle
        setFormData((prevData: any) => ({
            ...prevData,
            gender: selectedGender === EnumGender.Male ? 0 : 1,  // 0 ya da 1 olarak formData'ya ekle
        }));
        localStorage.setItem('gender', selectedGender === EnumGender.Male ? '0' : '1');
    };
    

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const editProps = () => {
        if (user?.role == EnumRole.Agency) {
            setRoleName("Acenta");
        } else if (user?.role == EnumRole.Owner) {
            setRoleName("Mekan Sahibi");
        } else if (user?.role == EnumRole.Traveler) {
            setRoleName("Gezgin");
        }
    }

    const hiddenFields = ["id", "memberId", "role", "password"];

    const fieldLabels: { [key: string]: string } = {
        fullName: "İsim Soyisim",
        email: "E-posta",
        phoneNumber: "Telefon Numarası",
        address: "Adres",
        age: "Yaş",
        gender: "Cinsiyet",
        businessName: "İşletme Adı",
        companyName: "Şirket Adı",
        taxNumber: "Vergi Numarası",
        licenseNumber: "Lisans Numarası",
        webSiteUrl: "Web Sitesi",
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack direction="row" spacing={10} alignItems="flex-start">
                    <Stack direction="column" alignItems="center">
                        <Avatar alt="Profile Picture" src="/profile-picture.jpg" sx={{ width: 200, height: 200 }} />
                        <Typography variant="h5" sx={{ mt: 5 }}>
                            {user?.role !== undefined ? roleName : "Role not found"}
                        </Typography>

                    </Stack>

                    <Stack sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" gutterBottom>Profil Bilgileri</Typography>
                        {Object.keys(formData)
                            .filter((key) => !hiddenFields.includes(key))
                            .map((key) => (
                                isEditing ? (
                                    key === "gender" ? (
                                        <FormControl fullWidth margin="normal" key={key}>
                                            <InputLabel>Cinsiyet</InputLabel>
                                            <Select
                                                value={gender ?? ''}
                                                onChange={handleGenderChange}
                                                label="Cinsiyet"
                                            >
                                                <MenuItem value={EnumGender.Male}>Erkek</MenuItem>
                                                <MenuItem value={EnumGender.Female}>Kadın</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            key={key}
                                            fullWidth
                                            label={fieldLabels[key] || key}
                                            name={key}
                                            value={formData[key]}
                                            margin="normal"
                                            onChange={handleChange}
                                        />
                                    )
                                ) : (
                                    <Typography key={key} variant="body1" sx={{ mb: 2 }}>
                                        <strong>{fieldLabels[key] || key}:</strong>
                                        {key === 'gender' ? (formData[key] === 0 ? 'Erkek' : formData[key] === 1 ? 'Kadın' : 'Bilinmiyor') : formData[key]}
                                    </Typography>
                                )
                            ))
                        }
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            {isEditing ? (
                                <Stack direction={"row"} spacing={2}>
                                    <Button variant="contained" color="primary" onClick={handleSaveClick}>Kaydet</Button>
                                    <Button variant="outlined" color='secondary' onClick={handleCancelEdit}>İptal</Button>
                                </Stack>
                            ) : (
                                <Stack direction={"row"} spacing={2}>
                                    <Button variant="contained" color="primary" onClick={handleEditClick}>Bilgileri Düzenle</Button>
                                    <Button variant="outlined" color="secondary">Şifremi Değiştir</Button>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                </Stack>
            </Container>
        </Container>
    );
}
