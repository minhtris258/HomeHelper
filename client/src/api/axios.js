import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL Server của bạn
});

// Tự động thêm Token vào Header nếu có trong localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;