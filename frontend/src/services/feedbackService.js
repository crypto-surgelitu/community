import api from '../utils/api';

export const feedbackService = {
  submitFeedback: async (eventId, feedbackData) => {
    const { data } = await api.post(`/feedback/${eventId}/feedback`, feedbackData);
    return data;
  },
  
  getEventFeedback: async (eventId) => {
    const { data } = await api.get(`/feedback/${eventId}/feedback`);
    return data;
  },
  
  getFeedbackAnalytics: async (eventId) => {
    const { data } = await api.get(`/feedback/${eventId}/feedback/analytics`);
    return data;
  },
  
  getAllFeedback: async (filters = {}) => {
    const { data } = await api.get('/feedback', { params: filters });
    return data;
  }
};
