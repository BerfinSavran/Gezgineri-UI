import axios from "axios";
import { Agency } from "../types";
import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/Agency";

class AgencyService {
    public async CreateAgency(agency: Partial<Agency>){
        try {
            const response = await axios.post(baseUrl, agency);
            return response.data;
        } catch (error) {
            console.error("Error creating agency: ", error);
            throw error;
        }
    }

    public async GetAgencyByMemberId(id: string){
        try{
            const response = await axiosInstance.get(`${baseUrl}/memberid/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting agency: ", error);
            throw error;
        }
    }

    public async UpdateAgency(agency: Partial<Agency>) {
        try{
            const response = await axios.put(baseUrl, agency);
            return response.data;
        } catch (error) {
            console.error("Error getting traveler: ", error);
            throw error;
        }
    }
}

export default new AgencyService();