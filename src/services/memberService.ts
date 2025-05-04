import axiosInstance from "../context/axiosInstance";

const baseUrl = "https://localhost:7033/api/Member";

class MemberService{
    public async GetMemberById(id: string): Promise<any> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting member: ", error);
            throw error;
        }
    }

    public async GetAllMembers(): Promise<any> {
        try {
            const response = await axiosInstance.get(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    }
}

export default new MemberService();