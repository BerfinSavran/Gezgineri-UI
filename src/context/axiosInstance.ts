import axios from 'axios';
import AuthService from '../services/authService';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7033/api/',
});

// Tüm isteklerde `Authorization` başlığına token ekle
axiosInstance.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
