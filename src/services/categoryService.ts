import axios from "axios";
import { Category } from "../types";

const baseUrl = "https://localhost:7033/api/Category";

class CategoryService {
    // Kategori Ekle veya Güncelle
    public async AddOrUpdateCategory(category: Partial<Category>) {
        try {
            const response = await axios.post(baseUrl, category);
            return response.data;
        } catch (error) {
            console.error("Kategori eklenirken/güncellenirken hata oluştu:", error);
            throw error;
        }
    }

    // Kategori Sil
    public async DeleteCategory(id: string) {
        try {
            const response = await axios.delete(`${baseUrl}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Kategori silinirken hata oluştu:", error);
            throw error;
        }
    }

    // Tüm Kategorileri Getir
    public async GetAllCategories() {
        try {
            const response = await axios.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Kategoriler getirilirken hata oluştu:", error);
            throw error;
        }
    }

    // ID ile Kategori Getir
    public async GetCategoryById(id: string) {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Kategori getirilirken hata oluştu:", error);
            throw error;
        }
    }
}

export default new CategoryService();
