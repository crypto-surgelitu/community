import api from '../utils/api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Store token
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  
  changePassword: async (oldPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password', { 
      oldPassword, 
      newPassword 
    });
    return data;
  }
};
