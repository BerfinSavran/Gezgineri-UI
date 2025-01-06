import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Stack, Avatar, Button, TextField } from '@mui/material';
import { useAuth } from '../context/authContext';
import { EnumRole, Traveler } from '../types';
import travelerService from '../services/travelerService';
import agencyService from '../services/agencyService';
import ownerService from '../services/ownerService';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        try {
            if (!user?.id) return;

            switch (user.role) {
                case EnumRole.Traveler:
                    const travelerData = await travelerService.GetTravelerByMemberId(user.id);
                    setFormData(travelerData);
                    break;
                case EnumRole.Agency:
                    const agencyData = await agencyService.GetAgencyByMemberId(user.id);
                    setFormData(agencyData);
                    break;
                case EnumRole.Owner:
                    const ownerData = await ownerService.GetOwnerByMemberId(user.id);
                    setFormData(ownerData);
                    break;
                default:
                    setError('Unknown role');
            }
        } catch (err) {
            setError('Error fetching user data');
        }
    };

    const handleEditClick = () => setIsEditing(true);
    const handleSaveClick = () => setIsEditing(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: any) => ({ ...prevData, [name]: value }));
    };

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    if (!formData) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const getRoleName = (role: EnumRole): string => {
        switch (role) {
            case EnumRole.Admin:
                return 'Admin';
            case EnumRole.Traveler:
                return 'Traveler';
            case EnumRole.Agency:
                return 'Agency';
            case EnumRole.Owner:
                return 'Owner';
            default:
                return 'Unknown Role';
        }
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack direction="row" spacing={10} alignItems="flex-start">
                    {/* Profile Picture and Role */}
                    <Stack direction="column" alignItems={"center"}>
                        <Avatar
                            alt="Profile Picture"
                            src="/profile-picture.jpg"
                            sx={{ width: 200, height: 200 }}
                        />
                        <Typography variant="h5" sx={{ mt: 5 }}>
                            {user?.role ? getRoleName(user.role) : "Role not found"}
                        </Typography>
                    </Stack>

                    {/* Profile Information */}
                    <Stack sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" gutterBottom>
                            Profil Bilgileri
                        </Typography>

                        {/* Traveler Role */}
                        {user?.role === EnumRole.Traveler && (
                            <>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Ad Soyad"
                                        name="fullName"
                                        value={formData.fullName}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Ad Soyad:</strong> {formData.fullName}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="E-posta"
                                        name="email"
                                        value={formData.email}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>E-posta:</strong> {formData.email}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Cinsiyet"
                                        name="gender"
                                        value={formData.gender}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Cinsiyet:</strong> {formData.gender}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Yaş"
                                        name="age"
                                        value={formData.age}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Yaş:</strong> {formData.age}
                                    </Typography>
                                )}{isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="telefon-numarası"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Telefon Numarası:</strong> {formData.phoneNumber}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* Agency Role */}
                        {user?.role === EnumRole.Agency && (
                            <>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Ad Soyad"
                                        name="fullName"
                                        value={formData.fullName}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Ad Soyad:</strong> {formData.fullName}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="E-posta"
                                        name="email"
                                        value={formData.email}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>E-posta:</strong> {formData.email}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Şirket-İsmi"
                                        name="companyName"
                                        value={formData.companyName}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Şirket İsmi:</strong> {formData.companyName}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Adres"
                                        name="address"
                                        value={formData.address}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Adres:</strong> {formData.address}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Telefon-Numarası"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Telefon Numarası:</strong> {formData.phoneNumber}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Web-Sİte-Url"
                                        name="webSiteUrl"
                                        value={formData.webSiteUrl}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Web Site:</strong> {formData.webSiteUrl}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Vergi-Numarası"
                                        name="taxNumber"
                                        value={formData.taxNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Vergi Numarası:</strong> {formData.taxNumber}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Lisans-Numarası"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Lisans Numarası:</strong> {formData.licenseNumber}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* Owner Role */}
                        {user?.role === EnumRole.Owner && (
                            <>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Ad Soyad"
                                        name="fullName"
                                        value={formData.fullName}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Ad Soyad:</strong> {formData.fullName}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="E-posta"
                                        name="email"
                                        value={formData.email}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>E-posta:</strong> {formData.email}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="İşletme-İsmi"
                                        name="businessName"
                                        value={formData.businessName}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>İşletme İsmi:</strong> {formData.businessName}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Adres"
                                        name="address"
                                        value={formData.address}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Adres:</strong> {formData.address}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Telefon-Numarası"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Telefon Numarası:</strong> {formData.phoneNumber}
                                    </Typography>
                                )}
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Lisans-Numarası"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Lisans Numarası:</strong> {formData.licenseNumber}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            {isEditing ? (
                                <Button variant="contained" color="primary" onClick={handleSaveClick}>
                                    Kaydet
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleEditClick}>
                                    Bilgileri Düzenle
                                </Button>
                            )}
                            <Button variant="outlined" color="secondary">
                                Şifremi Değiştir
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Container>
    );
}



