import axios from "axios";

const baseUrl = "https://localhost:7033/api/Member";

class MemberService{
    public async GetMemberById(id: string): Promise<any> {
        try {
            const response = await axios.get(`${baseUrl}/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting member: ", error);
            throw error;
        }
    }
}

export default new MemberService();