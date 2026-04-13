import { authService } from '../services/authService.js';
import { User } from '../models/index.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.validatedBody;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials' || error.message === 'Account suspended') {
        res.status(401).json({ error: error.message, status: 401 });
      } else {
        next(error);
      }
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found', status: 404 });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.validatedBody;
      const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Invalid old password') {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  }
};
