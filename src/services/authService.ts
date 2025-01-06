import axios from 'axios';
import { Member } from '../types';

const baseUrl = 'https://localhost:7033/api/Auth';

class AuthService {
  public async login(email: string, password: string): Promise<Member> {
    try {
      const response = await axios.post(baseUrl, { email, password });
      const member: Member = response.data.member; // API'den dönen kullanıcı bilgisi
      return member;
    } catch (error) {
      console.error('Login error: ', error);
      throw error;
    }
  }
}

export default new AuthService();
