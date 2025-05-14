import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Divider, Stack } from '@mui/material';
import { useAuth } from '../context/authContext';
import placeService from '../services/placeService';
import tourService from '../services/tourService';
import memberService from '../services/memberService';
import travelerService from '../services/travelerService';
import agencyService from '../services/agencyService';
import ownerService from '../services/ownerService';
import { EnumStatus } from '../types';
import { showErrorToast } from '../utils/toastHelper';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState<number>(0);
  const [tours, setTours] = useState<number>(0);
  const [pendingPlaces, setPendingPlaces] = useState<number>(0);
  const [pendingTours, setPendingTours] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [roleCounts, setRoleCounts] = useState({ traveler: 0, agency: 0, owner: 0 });

  useEffect(() => {
    fetchMembers();
    fetchRoleCounts();
    fetchPlaces();
    fetchTours();
  }, [user]);

  const fetchMembers = async () => {
    try {
      const data = await memberService.GetAllMembers();
      setTotalParticipants(data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kullanıcılar alınırken hata oluştu.";
      showErrorToast(errorMessage);
    }
  };

  const fetchRoleCounts = async () => {
    try {
      const travelers = await travelerService.GetAllTravelers();
      const agencies = await agencyService.GetAllAgencies();
      const owners = await ownerService.GetAllOwners();
      setRoleCounts({
        traveler: travelers.length,
        agency: agencies.length,
        owner: owners.length,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Roller alınırken hata oluştu.";
      showErrorToast(errorMessage);
    }
  };

  const fetchPlaces = async () => {
    try {
      const data = await placeService.GetAllPlaces();

      const pending = data.filter((place: any) => place.status === EnumStatus.Pending);
      const approved = data.filter((place: any) => place.status === EnumStatus.Approved);
      setPlaces(approved.length);
      setPendingPlaces(pending.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Mekanlar alınırken hata oluştu.";
      showErrorToast(errorMessage);
    }
  };

  const fetchTours = async () => {
    try {
      const data = await tourService.GetAllWithInclude();

      const pending = data.filter((tour: any) => tour.status === EnumStatus.Pending);
      const approved = data.filter((tour: any) => tour.status === EnumStatus.Approved);
      setTours(approved.length);
      setPendingTours(pending.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Turlar alınırken hata oluştu.";
      showErrorToast(errorMessage);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, ml: 15 }}>
      <Card>
        <Stack direction={"column"}>
          <Stack direction={"row"}>
            {/* Toplam Katılımcı Kartı */}
            <Card sx={{ mb: 2, maxWidth: 1200, width: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Toplam Katılımcı Sayısı
                </Typography>
                <Typography variant="h4">{totalParticipants}</Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction={"row"} justifyContent={'space-between'} spacing={2}>
            {/* Toplam Traveler, Agency, Owner Kartları */}
            <Card sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Toplam Traveler Sayısı
                </Typography>
                <Typography variant="h5">{roleCounts.traveler}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Toplam Agency Sayısı
                </Typography>
                <Typography variant="h5">{roleCounts.agency}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Toplam Owner Sayısı
                </Typography>
                <Typography variant="h5">{roleCounts.owner}</Typography>
              </CardContent>
            </Card>
          </Stack>


          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          <Stack direction={"column"} spacing={2}>
            <Stack direction={"row"} justifyContent={'space-between'} spacing={2}>
              {/* Onay Bekleyen Mekan ve Tur Kartları */}
              <Card sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Toplam Mekan Sayısı
                  </Typography>
                  <Typography variant="h5">{places}</Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Toplam Tur Sayısı
                  </Typography>
                  <Typography variant="h5">{tours}</Typography>
                </CardContent>
              </Card>
            </Stack>

            <Stack direction={"row"} justifyContent={'space-between'} spacing={2}>
              {/* Onay Bekleyen Mekan ve Tur Kartları */}
              <Card sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Onay Bekleyen Mekan Sayısı
                  </Typography>
                  <Typography variant="h5">{pendingPlaces}</Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Onay Bekleyen Tur Sayısı
                  </Typography>
                  <Typography variant="h5">{pendingTours}</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
