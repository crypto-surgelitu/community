import api from '../utils/api';

export const feedbackService = {
  submitFeedback: async (eventId, feedbackData) => {
    // feedbackData: { rating, sentiment, text }
    const { data } = await api.post(`/events/${eventId}/feedback`, feedbackData);
    return data;
  },
  
  getEventFeedback: async (eventId) => {
    const { data } = await api.get(`/events/${eventId}/feedback`);
    return data;
  },
  
  getFeedbackAnalytics: async (eventId) => {
    const { data } = await api.get(`/events/${eventId}/feedback/analytics`);
    return data;
  },
  
  getAllFeedback: async (filters = {}) => {
    const { data } = await api.get('/feedback', { params: filters });
    return data;
  }
};
