import api from '../utils/api';

export const templateService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/templates');
      return data.templates || [];
    } catch {
      return [];
    }
  },
  
  getById: async (templateId) => {
    const { data } = await api.get(`/templates/${templateId}`);
    return data;
  },
  
  create: async (templateData) => {
    const { data } = await api.post('/templates', templateData);
    return data;
  },
  
  update: async (templateId, templateData) => {
    const { data } = await api.put(`/templates/${templateId}`, templateData);
    return data;
  },
  
  delete: async (templateId) => {
    const { data } = await api.delete(`/templates/${templateId}`);
    return data;
  }
};
