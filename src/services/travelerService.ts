import { Traveler } from "../types";
import axiosInstance from "../context/axiosInstance";
import axios from "axios";

const baseUrl = "https://localhost:7033/api/Traveler";

class TravelerService{
    public async CreateTraveler(traveler: Partial<Traveler>){
        try{
            const response = await axios.post(baseUrl, traveler);
            return response.data;
        } catch (error) {
            console.error("Error creating traveler: ", error);
            throw error;
        }
    }

    public async GetAllTravelers(): Promise<any> {
        try {
            const response = await axiosInstance.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting travelers: ", error);
            throw error;
        }
    }

    public async GetTravelerByMemberId(id: string): Promise<any> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/memberid/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting traveler: ", error);
            throw error;
        }
    }

    public async UpdateTraveler(traveler : Partial<Traveler>) {
        try{
            const response = await axiosInstance.put(baseUrl, traveler);
            return response.data;
        } catch (error) {
            console.error("Error getting traveler: ", error);
            throw error;
        }
    }
    
}

export default new TravelerService();