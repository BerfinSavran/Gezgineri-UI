import { useEffect, useState } from "react";
import { Tour } from "../types";
import Board from "../components/board";
import { useAuth } from "../context/authContext";
import { Container } from "@mui/material";
import Card from "../components/card"
import tourService from "../services/tourService";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

function ApprovalTours() {
    const { user } = useAuth();
    const [toursforAgency, setToursforAgency] = useState<Tour[]>([]);
    const [tours, setTours] = useState<Tour[]>([]);

    useEffect(() => {
        if (!user) return;

        if (user.role === 0) {
            fetchAllToursPlacesForAdmin();
        } else if (user.role === 2) {
            fetchToursforAgency();
        }
    }, [user]);

    const fetchToursforAgency = async () => {
        if (!user?.agencyId) return;
        try {
            const data = await tourService.GetToursByAgencyIdWithInclude(user?.agencyId);
            setToursforAgency(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Turlar alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };


    const fetchAllToursPlacesForAdmin = async () => {
        try {
            const data = await tourService.GetAllWithInclude();
            setTours(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Turlar alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const renderColumn = (column: string, value: any) => {
        if (column === "status") {
            if (value === 0) return "Pending";
            if (value === 1) return "Approved";
            if (value === 2) return "Rejected";
        }
        if (column === "startDate" || column === "endDate" || column === "date") {
            const date = new Date(value);
            const formatted = date.toLocaleDateString("tr-TR"); // "16.04.2025"
            return formatted;
        }

        return value;
    };


    const handleApprove = async (item: Tour) => {
        try {
            const updatedTour = {
                ...item,
                status: 1
            };

            await tourService.AddOrUpdateTour(updatedTour)
                .then(() => { showSuccessToast("Tur başarıyla onaylandı.") })
                .catch((err) => { showErrorToast(err) });

            setTours(prev => prev.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Onaylama sırasında hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handleDeny = async (item: Tour) => {
        try {
            const updatedTour = {
                ...item,
                status: 2
            };

            await tourService.AddOrUpdateTour(updatedTour)
                .then(() => { showSuccessToast("Tur başarıyla reddedildi.") })
                .catch((err) => { showErrorToast(err) });

            setTours(prev => prev.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Reddetme sırasında hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const isApprovable = (item: any) => {
        switch (user?.role) {
            case 0: // Admin
                return true;
            case 2: // Agency
                return false;
            default:
                return false;
        }
    };

    const isDeniable = (item: any) => {
        switch (user?.role) {
            case 0: // Admin
                return true;
            case 2: // Agency
                return false;
            default:
                return false;
        }
    };

    const columnNames = {
        companyName: "Acenta Adı",
        categoryName: "Kategori Adı",
        startDate: "Başlangıç Tarihi",
        endDate: "Bitiş Tarihi",
        name: "Tur Adı",
        status: "Durum"
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Card title={"Onay Bekleyen Turlar"}>
                    <Board
                        items={user?.role === 0 ? tours : toursforAgency}
                        columnNames={columnNames}
                        onApprove={handleApprove}
                        onDeny={handleDeny}
                        isApprovable={isApprovable}
                        isDeniable={isDeniable}
                        hiddenColumns={[
                            "id",
                            "agencyId",
                            "categoryId",
                            "description",
                            "imageUrl",
                            "webSiteUrl",
                            "price",
                            "capacity",
                            "approvedById"
                        ]}
                        renderColumn={renderColumn}
                        hideActions={user?.role === 2 ? "true" : "false"}
                    />

                </Card>
            </Container>
        </Container>
    );
}

export default ApprovalTours;
