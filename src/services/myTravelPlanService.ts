import axios from "axios";
import { MyTravelPlan } from "../types";  // MyTravelPlan tipi kullandığınızı varsayıyorum

const baseUrl = "https://localhost:7033/api/MyTravelPlan";  // API'nin doğru URL'si

class MyTravelPlanService {
    // Add or Update Travel Plan
    public async AddOrUpdateTravelPlan(travelPlan: MyTravelPlan) {
        try {
            const response = await axios.post(baseUrl, travelPlan);
            return response.data;
        } catch (error) {
            console.error("Error creating or updating travel plan:", error);
            throw error;
        }
    }

    // Get all travel plans
    public async GetAllTravelPlans(): Promise<MyTravelPlan[]> {
        try {
            const response = await axios.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting travel plans:", error);
            throw error;
        }
    }

    // Get a specific travel plan by ID
    public async GetTravelPlanById(id: string): Promise<MyTravelPlan> {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting travel plan by id:", error);
            throw error;
        }
    }

    public async GetTravelPlansByTravelId(travelId: string): Promise<MyTravelPlan[]> {
        try {
            const response = await axios.get(`${baseUrl}/travelId/${travelId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting travel plan by id:", error);
            throw error;
        }
    }

    // Delete a specific travel plan by ID
    public async DeleteTravelPlan(id: string) {
        try {
            const response = await axios.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting travel plan:", error);
            throw error;
        }
    }
}

export default new MyTravelPlanService();
