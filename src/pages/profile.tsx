import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Stack, Avatar, Button, TextField } from '@mui/material';
import { EnumRole, Member } from '../types';
import travelerService from '../services/travelerService';
import agencyService from '../services/agencyService';
import ownerService from '../services/ownerService';
import authService from '../services/authService';
import memberService from '../services/memberService';
import { useAuth } from '../context/authContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({}); // Initialize as an empty object

    useEffect(() => {
        if (user) {
            fetchUserData(user);
        }
    }, [user]);

    const fetchUserData = async (decodedUser: any) => {
        try {
            let userData = null;
            switch (decodedUser.role) {
                case EnumRole.Traveler:
                    userData = await travelerService.GetTravelerByMemberId(decodedUser.id);
                    break;
                case EnumRole.Agency:
                    userData = await agencyService.GetAgencyByMemberId(decodedUser.id);
                    break;
                case EnumRole.Owner:
                    userData = await ownerService.GetOwnerByMemberId(decodedUser.id);
                    break;
                default:
                    console.error('Unknown role');
                    return;
            }
            setFormData(userData);
        } catch (err) {
            console.error('Error fetching user data', err);
        }
    };

    const handleEditClick = () => setIsEditing(true);
    const handleSaveClick = () => setIsEditing(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: any) => ({
            ...(prevData ?? {}),
            [name]: value
        }));
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Stack direction="row" spacing={10} alignItems="flex-start">
                    <Stack direction="column" alignItems="center">
                        <Avatar alt="Profile Picture" src="/profile-picture.jpg" sx={{ width: 200, height: 200 }} />
                        <Typography variant="h5" sx={{ mt: 5 }}>
                            {user?.role !== undefined ? EnumRole[user.role] : "Role not found"}
                        </Typography>

                    </Stack>

                    <Stack sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" gutterBottom>Profil Bilgileri</Typography>
                        {Object.keys(formData).map((key) => (
                            isEditing ? (
                                <TextField
                                    key={key}
                                    fullWidth
                                    label={key}
                                    name={key}
                                    value={formData[key]}
                                    margin="normal"
                                    onChange={handleChange}
                                />
                            ) : (
                                <Typography key={key} variant="body1" sx={{ mb: 2 }}>
                                    <strong>{key}:</strong> {formData[key]}
                                </Typography>
                            )
                        ))}
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            {isEditing ? (
                                <Button variant="contained" color="primary" onClick={handleSaveClick}>Kaydet</Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleEditClick}>Bilgileri Düzenle</Button>
                            )}
                            <Button variant="outlined" color="secondary">Şifremi Değiştir</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Container>
    );
}
