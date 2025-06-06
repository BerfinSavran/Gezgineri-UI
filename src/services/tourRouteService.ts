import axiosInstance from "../context/axiosInstance";
import { TourRoute } from "../types";

const baseUrl = "https://localhost:7033/api/TourRoute";

class TourRouteService {
    public async AddOrUpdateTourRoute(tourRoute: Partial<TourRoute>) {
        try {
            const response = await axiosInstance.post(baseUrl, tourRoute);
            return response.data;
        } catch (error) {
            console.error("Error creating or updating tour route:", error);
            throw error;
        }
    }

    public async GetAllTourRoutes(): Promise<TourRoute[]> {
        try {
            const response = await axiosInstance.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting tour routes:", error);
            throw error;
        }
    }

    public async GetTourRouteById(id: string): Promise<TourRoute> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting tour route:", error);
            throw error;
        }
    }

    public async DeleteTourRoute(id: string) {
        try {
            const response = await axiosInstance.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting tour route:", error);
            throw error;
        }
    }

    public async GetTourRoutesByTourId(tourid: string): Promise<TourRoute[]> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/tourid/${tourid}`);
            return response.data;
        } catch (error) {
            console.error("Error getting tour route:", error);
            throw error;
        }
    }
}

export default new TourRouteService();
