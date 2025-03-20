import axios from "axios";
import { FavoritePlace } from "../types";

const baseUrl = "https://localhost:7033/api/FavoritePlace";

class FavoritePlaceService {

    async CheckFavorite(travelerid: string, placeid: string) {
        try {
            const response = await axios.get(`${baseUrl}/CheckFavorite?travelerid=${travelerid}&placeid=${placeid}`);
            return response.data;
        } catch (error) {
            console.error("CheckFavorite error:", error);
            throw error;
        }
    }

    async AddOrUpdateFavoritePlace(favoritePlace: Partial<FavoritePlace>) {
        try {
            const response = await axios.post(`${baseUrl}`, favoritePlace);
            return response.data;
        } catch (error) {
            console.error("AddOrUpdateFavoritePlace error:", error);
            throw error;
        }
    }

    async DeleteFavoritePlace(id: string) {
        try {
            const response = await axios.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("DeleteFavoritePlace error:", error);
            throw error;
        }
    }

    async GetAllFavoritePlaces() {
        try {
            const response = await axios.get(`${baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("GetAllFavoritePlaces error:", error);
            throw error;
        }
    }

    async GetFavoritePlaceById(id: string) {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("GetFavoritePlaceById error:", error);
            throw error;
        }
    }
}

export default new FavoritePlaceService();
