import axiosInstance from "../context/axiosInstance";
import { MyTravel } from "../types";

const baseUrl = "https://localhost:7033/api/MyTravel";

class MyTravelService {
    public async AddOrUpdateMyTravel(myTravel: Partial<MyTravel>) {
        try {
            const response = await axiosInstance.post(baseUrl, myTravel);
            return response.data;
        } catch (error) {
            console.error("Error creating or updating travel:", error);
            throw error;
        }
    }

    public async GetAllMyTravels(): Promise<MyTravel[]> {
        try {
            const response = await axiosInstance.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting travels:", error);
            throw error;
        }
    }

    public async GetMyTravelById(id: string): Promise<MyTravel> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting travel by id:", error);
            throw error;
        }
    }

    public async DeleteMyTravel(id: string) {
        try {
            const response = await axiosInstance.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting travel:", error);
            throw error;
        }
    }

    public async GetMyTravelsByTravelerId(travelerid: string): Promise<MyTravel[]> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/travelerid/${travelerid}`);
            return response.data;
        } catch (error) {
            console.error("Error getting travel by id:", error);
            throw error;
        }
    }
}

export default new MyTravelService();
