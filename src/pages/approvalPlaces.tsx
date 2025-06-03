import { useEffect, useState } from "react";
import { Place } from "../types";
import Board from "../components/board";
import { useAuth } from "../context/authContext";
import placeService from "../services/placeService";
import { Container, Typography } from "@mui/material";
import Card from "../components/card"
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

function ApprovalPlaces() {
    const { user } = useAuth();
    const [placesforOwner, setPlacesforOwner] = useState<Place[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        if (!user) return;

        if (user.role === 0) {
            fetchAllPlacesForAdmin();
        } else if (user.role === 3) {
            fetchPlacesforOwner();
        }
    }, [user]);

    const fetchPlacesforOwner = async () => {
        if (!user?.ownerId) return;
        try {
            const data = await placeService.GetPlacesByOwnerIdWithInclude(user?.ownerId);
            setPlacesforOwner(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Mekanlar alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const fetchAllPlacesForAdmin = async () => {
        try {
            const data = await placeService.GetAllPlaces();
            setPlaces(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Mekanlar alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };


    const renderColumn = (column: string, value: any) => {
        if (column === "status") {
            let text = "";
            let color = "";

            switch (value) {
                case 0:
                    text = "Pending";
                    color = "#999"; // Gri
                    break;
                case 1:
                    text = "Approved";
                    color = "green";
                    break;
                case 2:
                    text = "Rejected";
                    color = "red";
                    break;
                default:
                    text = "Bilinmiyor";
                    color = "#333";
            }

            return <span style={{ color, fontWeight: 500 }}>{text}</span>;
        }

        return value;
    };


    const handleApprove = async (item: Place) => {
        try {
            const updatedPlace = {
                ...item,
                status: 1
            };

            await placeService.AddOrUpdatePlace(updatedPlace)
                .then(() => { showSuccessToast("Mekan başarıyla onaylandı.") })
                .catch((err) => { showErrorToast(err) });

            setPlaces(prev => prev.map(place => place.id === updatedPlace.id ? updatedPlace : place));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Onaylama sırasında hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handleDeny = async (item: Place) => {
        try {
            const updatedPlace = {
                ...item,
                status: 2
            };

            await placeService.AddOrUpdatePlace(updatedPlace)
                .then(() => { showSuccessToast("Mekan başarıyla reddedildi.") })
                .catch((err) => { showErrorToast(err) });;

            setPlaces(prev => prev.map(place => place.id === updatedPlace.id ? updatedPlace : place));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Reddetme sırasında hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const isApprovable = (item: any) => {
        switch (user?.role) {
            case 0: // Admin
                return true;
            case 3: // Owner
                return false;
            default:
                return false;
        }
    };

    const isDeniable = (item: any) => {
        switch (user?.role) {
            case 0: // Admin
                return true;
            case 3: // Owner
                return false;
            default:
                return false;
        }
    };

    const columnNames = {
        businessName: "İşletme Adı",
        categoryName: "Kategori Adı",
        name: "Mekan Adı",
        city: "Şehir",
        country: "Ülke",
        status: "Durum"
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Card title={"Onay Bekleyen Mekanlar"}>
                    <Board
                        items={user?.role === 0 ? places : placesforOwner}
                        columnNames={columnNames}
                        onApprove={handleApprove}
                        onDeny={handleDeny}
                        isApprovable={isApprovable}
                        isDeniable={isDeniable}
                        hiddenColumns={[
                            "id",
                            "ownerId",
                            "categoryId",
                            "description",
                            "imageUrl",
                            "visitDuration",
                            "entryPrice",
                            "capacity",
                            "approvedById"
                        ]}
                        renderColumn={renderColumn}
                        hideActions={user?.role === 3 ? "true" : "false"}
                    />

                </Card>
            </Container>
        </Container>
    );
}

export default ApprovalPlaces;
