
import axiosInstance from "../context/axiosInstance";

class AuthService {

  public async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const response = await axiosInstance.post("Auth", { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      return { token };
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  }


  public async decodeToken(token: string): Promise<{id: string, email: string, role: number}> {
    try {
      const response = await axiosInstance.get(`Auth?token=${token}`);
      return response.data; // { id, email, role } dönmeli
    } catch (error) {
      console.error("Decode token error: ", error);
      throw error;
    }
  }

  public logout(): void {
    localStorage.removeItem("token");
  }

  public getToken(): string | null {
    return localStorage.getItem("token");
  }
}

export default new AuthService();
