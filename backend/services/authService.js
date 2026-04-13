import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';

export const authService = {
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      logger.warn('Login failed - user not found', { email });
      throw new Error('Invalid credentials');
    }
    
    if (user.status === 'suspended') {
      logger.warn('Login failed - account suspended', { email });
      throw new Error('Account suspended');
    }
    
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      logger.warn('Login failed - invalid password', { email });
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );
    
    await user.update({ lastLoginAt: new Date() });
    
    logger.log('User logged in', { userId: user.id, email });
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      },
      expiresIn: config.jwt.expire
    };
  },

  async hashPassword(password) {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 10);
  },

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }
    
    await user.update({ password: newPassword });
    
    logger.log('Password changed', { userId });
    
    return { message: 'Password changed successfully' };
  },

  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return user.toJSON();
  }
};
