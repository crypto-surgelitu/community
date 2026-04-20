import api from '../utils/api';

export const eventService = {
  getAll: async (filters = {}) => {
    try {
      const { data } = await api.get('/events', { params: filters });
      const events = (data.events || []).map(event => ({
        id: event.id,
        name: event.title,
        date: event.eventDate,
        location: event.location,
        capacity: event.maxCapacity,
        attendees: event.attendanceCount,
        status: event.status,
        program: event.program,
        organizer: event.organizer,
        zone: event.zone
      }));
      return { events, total: data.total };
    } catch {
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
  },
  
  getPrograms: async () => {
    const { data } = await api.get('/dashboard/programs');
    return data.programs || [];
  }
};
