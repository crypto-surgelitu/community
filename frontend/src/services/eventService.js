import api from '../utils/api';

export const eventService = {
  getAll: async (filters = {}) => {
    // try to fetch real data, fallback to empty array or mocked data if 404
    try {
      const { data } = await api.get('/events', { params: filters });
      return data;
    } catch (e) {
      return { events: [], total: 0 };
    }
  },
  
  getById: async (eventId) => {
    const { data } = await api.get(`/events/${eventId}`);
    return data;
  },
  
  create: async (eventData) => {
    const { data } = await api.post('/events', eventData);
    return data;
  },
  
  update: async (eventId, eventData) => {
    const { data } = await api.put(`/events/${eventId}`, eventData);
    return data;
  },
  
  delete: async (eventId) => {
    const { data } = await api.delete(`/events/${eventId}`);
    return data;
  },
  
  checkIn: async (eventId, memberId) => {
    const { data } = await api.post(`/events/${eventId}/checkin`, { memberId });
    return data;
  },
  
  getAttendance: async (eventId) => {
    const { data } = await api.get(`/events/${eventId}/attendance`);
    return data;
  },
  
  publishEvent: async (eventId) => {
    const { data } = await api.post(`/events/${eventId}/publish`);
    return data;
  }
};
