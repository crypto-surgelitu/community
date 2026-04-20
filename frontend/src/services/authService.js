import api from '../utils/api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    
    // CRITICAL: Must persist the token so the app sees the user as logged in
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
