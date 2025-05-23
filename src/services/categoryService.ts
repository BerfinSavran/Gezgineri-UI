import { Category } from "../types";
import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/Category";

class CategoryService {
    public async AddOrUpdateCategory(category: Partial<Category>) {
        try {
            const response = await axiosInstance.post(baseUrl, category);
            return response.data;
        } catch (error) {
            console.error("Kategori eklenirken/güncellenirken hata oluştu:", error);
            throw error;
        }
    }

    public async DeleteCategory(id: string) {
        try {
            const response = await axiosInstance.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Kategori silinirken hata oluştu:", error);
            throw error;
        }
    }

    public async GetAllCategories() {
        try {
            const response = await axiosInstance.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Kategoriler getirilirken hata oluştu:", error);
            throw error;
        }
    }

    public async GetCategoryById(id: string) {
        try {
            const response = await axiosInstance.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Kategori getirilirken hata oluştu:", error);
            throw error;
        }
    }
}

export default new CategoryService();
