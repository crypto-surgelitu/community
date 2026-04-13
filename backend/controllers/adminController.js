import { adminService } from '../services/adminService.js';

export const adminController = {
  async createUser(req, res, next) {
    try {
      const user = await adminService.createUser(req.validatedBody);
      res.status(201).json(user);
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUser(req.params.userId, req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async resetPassword(req, res, next) {
    try {
      const result = await adminService.resetPassword(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async findAllUsers(req, res, next) {
    try {
      const filters = {
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const result = await adminService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getBackup(req, res, next) {
    try {
      const result = await adminService.getBackup();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async createProgram(req, res, next) {
    try {
      const program = await adminService.createProgram(req.validatedBody, req.user.id);
      res.status(201).json(program);
    } catch (error) {
      next(error);
    }
  },

  async updateProgram(req, res, next) {
    try {
      const program = await adminService.updateProgram(req.params.programId, req.body);
      res.status(200).json(program);
    } catch (error) {
      if (error.message === 'Program not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  }
};
