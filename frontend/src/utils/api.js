import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Permission denied
      toast.error('You do not have permission to do this');
    }
    if (error.response?.status === 500) {
      // Server error
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default api;
