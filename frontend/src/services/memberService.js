import api from '../utils/api';

export const memberService = {
  getAll: async (filters = {}) => {
    try {
      const { data } = await api.get('/members', { params: filters });
      return data;
    } catch {
      return { members: [], total: 0 };
    }
  },
  
  getById: async (memberId) => {
    const { data } = await api.get(`/members/${memberId}`);
    return data;
  },
  
  create: async (memberData) => {
    const { data } = await api.post('/members', memberData);
    return data;
  },
  
  update: async (memberId, memberData) => {
    const { data } = await api.put(`/members/${memberId}`, memberData);
    return data;
  },
  
  delete: async (memberId) => {
    const { data } = await api.delete(`/members/${memberId}`);
    return data;
  },
  
  bulkImport: async (csvData) => {
    // csvData: parsed array of { name, phone, email, zone, programs }
    const { data } = await api.post('/members/bulk-import', { members: csvData });
    return data;
  },
  
  getTimeline: async (memberId) => {
    const { data } = await api.get(`/members/${memberId}/timeline`);
    return data;
  },
  
  sendMessage: async (memberId, message) => {
    const { data } = await api.post(`/members/${memberId}/message`, { message });
    return data;
  },
  
  getZones: async () => {
    const { data } = await api.get('/dashboard/zones');
    return data.zones || [];
  }
};
