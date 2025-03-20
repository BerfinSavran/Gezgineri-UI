import axios from "axios";
import { Place } from "../types";

const baseUrl = "https://localhost:7033/api/Place";

class PlaceService {
    public async AddOrUpdatePlace(place: Partial<Place>) {
        try {
            const response = await axios.post(baseUrl, place);
            return response.data;
        } catch (error) {
            console.error("Error creating or updating place:", error);
            throw error;
        }
    }

    public async GetAllPlaces(): Promise<Place[]> {
        try {
            const response = await axios.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting places:", error);
            throw error;
        }
    }

    public async GetPlaceById(id: string): Promise<Place> {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting place:", error);
            throw error;
        }
    }

    public async DeletePlace(id: string) {
        try {
            const response = await axios.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting place:", error);
            throw error;
        }
    }

    public async GetPlacesByOwnerIdWithInclude(id: string) {
        try {
            const response = await axios.get(`${baseUrl}/ownerid`, {
                params: { ownerid: id }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting places:", error);
            throw error;
        }
    }

    public async GetPlacesByLocationWithInclude(country: string, city?: string): Promise<Place[]> {
        try {
            // Eğer şehir parametresi varsa query olarak ekle, yoksa sadece ülkeyi gönder
            const url = city
                ? `${baseUrl}/location/${country}?city=${city}`
                : `${baseUrl}/location/${country}`;
            
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error getting places:", error);
            throw error;
        }
    }
    
}

export default new PlaceService();
