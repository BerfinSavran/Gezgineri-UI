import axios from "axios";
import { Tour } from "../types";

const baseUrl = "https://localhost:7033/api/Tour";

class TourService {
    public async AddOrUpdateTour(tour: Partial<Tour>) {
        try {
            const response = await axios.post(baseUrl, tour);
            return response.data;
        } catch (error) {
            console.error("Error creating or updating tour:", error);
            throw error;
        }
    }

    public async GetAllWithInclude(): Promise<Tour[]> {
        try {
            const response = await axios.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting tours:", error);
            throw error;
        }
    }

    public async GetTourByIdWithInclude(id: string): Promise<Tour> {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting tour:", error);
            throw error;
        }
    }

    public async DeleteTour(id: string) {
        try {
            const response = await axios.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting tour:", error);
            throw error;
        }
    }

    public async GetToursByAgencyIdWithInclude(id: string) {
        try {
            const response = await axios.get(`${baseUrl}/agencyid`, {
                params: { agencyid: id }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting tours:", error);
            throw error;
        }
    }

    public async GetToursStartingFromToday(): Promise<Tour[]> {
        try {
            const response = await axios.get(`${baseUrl}/GetToursStartingFromToday`);
            return response.data;
        } catch (error) {
            console.error("Error getting tours:", error);
            throw error;
        }
    }

}

export default new TourService();
