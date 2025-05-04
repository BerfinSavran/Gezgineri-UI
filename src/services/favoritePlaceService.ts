import { FavoritePlace } from "../types";
import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/FavoritePlace";

class FavoritePlaceService {

    async CheckFavorite(travelerid: string, placeid: string) {
        try {
            const response = await axiosInstance.get(`${baseUrl}/CheckFavorite?travelerid=${travelerid}&placeid=${placeid}`);
            return response.data;
        } catch (error) {
            console.error("CheckFavorite error:", error);
            throw error;
        }
    }

    async AddOrUpdateFavoritePlace(favoritePlace: Partial<FavoritePlace>) {
        try {
            const response = await axiosInstance.post(`${baseUrl}`, favoritePlace);
            return response.data;
        } catch (error) {
            console.error("AddOrUpdateFavoritePlace error:", error);
            throw error;
        }
    }

    async DeleteFavoritePlace(id: string) {
        try {
            const response = await axiosInstance.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("DeleteFavoritePlace error:", error);
            throw error;
        }
    }

    async GetAllFavoritePlaces() {
        try {
            const response = await axiosInstance.get(`${baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("GetAllFavoritePlaces error:", error);
            throw error;
        }
    }

    async GetFavoritePlaceById(id: string) {
        try {
            const response = await axiosInstance.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("GetFavoritePlaceById error:", error);
            throw error;
        }
    }
}

export default new FavoritePlaceService();
