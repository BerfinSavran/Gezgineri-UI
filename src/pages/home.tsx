import { Container, Button, Stack, Card, CardContent, Typography, Box, IconButton, CardMedia } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useEffect, useState } from 'react';
import Search from '../components/search';
import { useAuth } from '../context/authContext';
import { Category, Place, Tour } from '../types';
import placeService from '../services/placeService';
import tourService from '../services/tourService';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../utils/toastHelper';
import categoryService from '../services/categoryService';

export default function HomePage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [startIndex, setStartIndex] = useState(0);
	const [placesforOwner, setPlacesforOwner] = useState<Place[]>([]);
	const [placesforTraveler, setPlacesforTraveler] = useState<Place[]>([]);
	const [tours, setTours] = useState<Tour[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const itemsPerPage = 3;

	useEffect(() => {
		fetchPlacesforOwner();
		fetchTours();
		fetchPlaceforTraveler();
		fetchCategories();
	}, [user]);

	const fetchCategories = async () => {
		try {
			const data = await categoryService.GetAllCategories();
			setCategories(data);
		} catch {
			showErrorToast("Kategoriler alınırken hata oluştu.");
		}
	};

	const fetchPlaceforTraveler = async () => {
		try {
			const data = await placeService.GetAllPlaces();
			if (data && Array.isArray(data)) {
				const approvedPlaces = data.filter(place => place.status === 1);
				setPlacesforTraveler(approvedPlaces);
			} else {
				showErrorToast("Beklenmeyen API yanıtı: Mekanlar alınamadı.");
				setPlacesforTraveler([]);
			}
		} catch (error) {
			showErrorToast("Mekanlar alınırken bir hata oluştu.");
			setPlacesforTraveler([]);
		}
	};

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		const filtered = placesforTraveler.filter((place) =>
			place.name.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredPlaces(filtered);
	};

	const handleCategoryClick = (category: Category) => {
		if (selectedCategory === category) {
			setSelectedCategory(null);
		} else {
			setSelectedCategory(category);
			const filtered = placesforTraveler.filter(place => place.categoryName === category.name);
			setFilteredPlaces(filtered);
		}
	};


	const handlePlaceCardClick = (placeId: string) => {
		navigate(`/place/${placeId}`);
	};

	const handleTourCardClick = (tourId: string) => {
		navigate(`/tour/id/${tourId}`);
	};

	const cards = placesforTraveler?.map((place) => ({
		id: place.id,
		title: place.name,
		description: place.description,
		country: place.country,
		city: place.city,
		imageUrl: place.imageUrl || "fotoğraf",
	})) || [];


	const handleNext = () => {
		if (startIndex + itemsPerPage < cards.length) {
			setStartIndex(startIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (startIndex > 0) {
			setStartIndex(startIndex - 1);
		}
	};

	const fetchPlacesforOwner = async () => {
		if (!user?.ownerId) return;
		try {
			const data = await placeService.GetPlacesByOwnerIdWithInclude(user?.ownerId);
			const approvedPlaces = data.filter((place: Place) => place.status === 1);
			setPlacesforOwner(approvedPlaces);
		} catch (error) {
			showErrorToast("Mekanlar alınırken bir hata oluştu.");
		}
	};

	const fetchTours = async () => {
		if (!user?.agencyId) return;
		try {
			const data = await tourService.GetToursByAgencyIdWithInclude(user?.agencyId);
			const approvedTours = data.filter((tour: Tour) => tour.status === 1);
			setTours(approvedTours);
		} catch (error) {
			showErrorToast("Turlar yüklenirken bir hata oluştu.");
		}
	};

	const formatDateForTypography = (dateString: string | undefined) => {
		if (!dateString) return "";
		const [year, month, day] = dateString.split("T")[0].split("-");
		return `${day}.${month}.${year}`; // "YYYY-MM-DD" → "DD.MM.YYYY"
	};

	const renderContent = () => {
		switch (user?.role) {
			case 1: // Traveler
				return (
					<Stack spacing={2} alignItems="center">
						{/* Kategori Butonları */}
						<Stack direction="row" spacing={2}>
							{categories.map((category) => (
								<Button
									key={category.name}
									variant="outlined"
									onClick={() => handleCategoryClick(category)}
									sx={{
										backgroundColor: selectedCategory === category ? "#1976d2" : "transparent", // Seçili buton rengi
										color: selectedCategory === category ? "white" : "#1976d2", // Seçili buton metni rengi
										'&:hover': {
											backgroundColor: selectedCategory === category ? "#1565c0" : "rgba(0, 0, 0, 0.08)", // Hover durumu
										},
									}}
								>
									{category.name}
								</Button>
							))}
						</Stack>

						<Search onSearch={handleSearchChange} />

						{searchQuery.trim() || selectedCategory ? (
							<Stack spacing={5} alignItems="center" sx={{ mt: 4 }}>
								{filteredPlaces.map((place) => (
									<Card
										onClick={() => handlePlaceCardClick(place.id)}
										key={place.id}
										sx={{
											width: "100%",
											height: "auto",
											border: "1px solid",
											padding: 2,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											overflow: 'hidden',
										}}>
										<Stack direction={"row"} spacing={2} alignItems="stretch">
											<Card
												sx={{
													width: "300px",
													height: "100%",  // yanındaki stack'e göre yüksekliği uzatıyoruz
													border: "1px solid",
													color: "gray",
													justifyContent: "center",
													alignItems: "center",
													display: "flex",
												}}
											>
												{place.imageUrl ? (
													<img
														src={place.imageUrl}
														alt={place.name}
														style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
													/>
												) : (
													"Fotoğraf"
												)}
											</Card>
											<Stack direction={"column"} spacing={"8px"}>
												<Typography variant="h6">Mekanın İsmi: {place.name} </Typography>
												<Typography variant="body1">Lokasyonu: {place.country}, {place.city} </Typography>
												<Typography variant="body1">Kategori: {place.categoryName} </Typography>
												<Typography variant="body1">İşletmenin İsmi: {place.businessName} </Typography>
												<Typography variant="body1">Kapasitesi: {place.capacity} </Typography>
												<Typography variant="body1">Gezi Süresi: {place.visitDuration} </Typography>
												<Typography variant="body1">Giriş Ücreti: {place.entryPrice} </Typography>
												<Typography variant="body1">Açıklama: {place.description} </Typography>
											</Stack>
										</Stack>
									</Card>
								))}
							</Stack>
						) : (
							<Stack spacing={2} alignItems="center" sx={{ paddingTop: 9, width: "100%" }}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									{/* Sola kaydırma butonu */}
									<IconButton onClick={handlePrevious} disabled={startIndex === 0}>
										<ArrowBackIosIcon />
									</IconButton>

									{/* Kartlar */}
									<Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
										{cards.slice(startIndex, startIndex + itemsPerPage).map((card) => (
											<Card
												key={card.id}
												variant="outlined"
												sx={{
													minWidth: 400,
													mx: 1,
													minHeight: 400,
													border: "1px solid",
													display: "flex",
													flexDirection: "column",
													cursor: "pointer"
												}}
												onClick={() => handlePlaceCardClick(card.id)}
											>
												{/* Kartın Üst Kısmı: Resim */}
												<CardMedia
													component="img"
													height="200"
													image={card.imageUrl || "fotoğraf"}
													alt={card.title}
													sx={{ objectFit: "cover" }}
												/>

												{/* Kartın İçeriği */}
												<CardContent sx={{ flexGrow: 1 }}>
													<Typography variant="h6" gutterBottom>
														{card.title}
													</Typography>
													<Typography variant="body2" color="text.secondary">
														{card.country + "," + card.city}
													</Typography>
												</CardContent>
											</Card>
										))}
									</Box>

									{/* Sağa kaydırma butonu */}
									<IconButton onClick={handleNext} disabled={startIndex + itemsPerPage >= cards.length}>
										<ArrowForwardIosIcon />
									</IconButton>
								</Box>
							</Stack>
						)}
					</Stack>

				);
			case 2: //agency
				return (

					<Stack spacing={5} alignItems={"center"}>
						{tours.map((tour) => (
							<Card
								onClick={() => handleTourCardClick(tour.id)}
								key={tour.id}
								sx={{
									width: "100%",
									height: "auto",
									border: "1px solid",
									padding: 2,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									overflow: 'hidden',
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
										{tour.imageUrl ? (
											<img
												src={tour.imageUrl}
												alt={tour.name}
												style={{ width: "100%", height: "100%", objectFit: "cover" }}
											/>
										) : (
											"Fotoğraf"
										)}
									</Card>
									<Stack direction={"column"} spacing={"8px"}>
										<Typography variant="h6">Turun İsmi: {tour.name} </Typography>
										<Typography variant="body1">Kapasitesi: {tour.capacity} </Typography>
										<Typography variant="body1">Acentanın İsmi: {tour.companyName} </Typography>
										<Typography variant="body1">Fiyatı: {tour.price} </Typography>
										<Typography variant="body1">Başlangıç Tarihi: {formatDateForTypography(tour.startDate)} </Typography>
										<Typography variant="body1">Bitiş Tarihi: {formatDateForTypography(tour.endDate)} </Typography>
										<Typography variant="body1">Açıklama: {tour.description} </Typography>
									</Stack>
								</Stack>
							</Card>
						))}
					</Stack>

				);
			case 3: // owner
				return (

					<Stack spacing={5} alignItems={"center"}>
						{placesforOwner.map((place) => (
							<Card
								onClick={() => handlePlaceCardClick(place.id)}
								key={place.id}
								sx={{
									width: "100%",
									height: "auto",
									border: "1px solid",
									padding: 2,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									overflow: 'hidden',
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
										{place.imageUrl ? (
											<img
												src={place.imageUrl}
												alt={place.name}
												style={{ width: "100%", height: "100%", objectFit: "cover" }}
											/>
										) : (
											"Fotoğraf"
										)}
									</Card>
									<Stack direction={"column"} spacing={"8px"}>
										<Typography variant="h6">Mekanın İsmi: {place.name} </Typography>
										<Typography variant="body1">Lokasyonu: {place.country}, {place.city} </Typography>
										<Typography variant="body1">Kategori: {place.categoryName} </Typography>
										<Typography variant="body1">İşletmenin İsmi: {place.businessName} </Typography>
										<Typography variant="body1">Kapasitesi: {place.capacity} </Typography>
										<Typography variant="body1">Gezi Süresi: {place.visitDuration} </Typography>
										<Typography variant="body1">Giriş Ücreti: {place.entryPrice} </Typography>
										<Typography variant="body1">Açıklama: {place.description} </Typography>
									</Stack>
								</Stack>
							</Card>
						))}
					</Stack>

				);
		}
	}

	return (
		<Container maxWidth="xl">
			<Container maxWidth="lg" sx={{ mt: 15 }}>

				{renderContent()}

			</Container>
		</Container>
	);
}
