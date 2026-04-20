import api from '../utils/api';

export const dashboardService = {
  getMetrics: async () => {
    const { data } = await api.get('/dashboard/metrics');
    return data;
  },

  getPrograms: async () => {
    const { data } = await api.get('/dashboard/programs');
    return data.programs || [];
  },

  getAtRiskMembers: async () => {
    const { data } = await api.get('/dashboard/at-risk-members');
    return data.atRiskMembers || [];
  },

  getZones: async () => {
    const { data } = await api.get('/dashboard/zones');
    return data.zones || [];
  }
};
