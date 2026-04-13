import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  async getMetrics(req, res, next) {
    try {
      const metrics = await dashboardService.getMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  },

  async getPrograms(req, res, next) {
    try {
      const result = await dashboardService.getPrograms();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getAtRiskMembers(req, res, next) {
    try {
      const result = await dashboardService.getAtRiskMembers();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
