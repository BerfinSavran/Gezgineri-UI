import { Owner } from "../types";
import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/Owner";

class OwnerService{
    public async CreateOwner(owner: Partial<Owner>){
        try {
            const response = await axiosInstance.post(baseUrl, owner);
            return response.data;
        } catch (error) {
            console.error("Error creating owner: ", error);
            throw error;
        }
    }

    public async GetAllOwners(): Promise<any> {
            try {
                const response = await axiosInstance.get(baseUrl);
                return response.data;
            } catch (error) {
                console.error("Error getting owners: ", error);
                throw error;
            }
        }

    public async GetOwnerByMemberId(id: string){
        try{
            const response = await axiosInstance.get(`${baseUrl}/memberid/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting owner: ", error);
            throw error;
        }
    }

    public async UpdateOwner(owner: Partial<Owner>){
        try {
            const response = await axiosInstance.put(baseUrl, owner);
            return response.data;
        }  catch (error) {
            console.error("Error getting traveler: ", error);
            throw error;
        }
    }
}

export default new OwnerService();