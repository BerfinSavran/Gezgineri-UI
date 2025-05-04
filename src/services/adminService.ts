import { Admin } from "../types";
import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/Admin";

class AdminService{
    public async CreateAdmin(admin: Partial<Admin>){
        try {
            const response = await axiosInstance.post(baseUrl, admin);
            return response.data;
        } catch (error) {
            console.error("Error creating Admin: ", error);
            throw error;
        }
    }

    public async GetAdminByMemberId(id: string){
        try{
            const response = await axiosInstance.get(`${baseUrl}/memberid/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting Admin: ", error);
            throw error;
        }
    }
}

export default new AdminService();