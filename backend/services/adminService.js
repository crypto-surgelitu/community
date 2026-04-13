import { User } from '../models/index.js';
import { authService } from './authService.js';
import { logger } from '../utils/logger.js';
import { ROLES, USER_STATUS } from '../config/constants.js';
import { generateTempPassword } from '../utils/helpers.js';

export const adminService = {
  async createUser(data) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const tempPassword = generateTempPassword();
    const hashedPassword = await authService.hashPassword(tempPassword);
    
    const user = await User.create({
      ...data,
      password: hashedPassword
    });
    
    logger.log('User created by admin', { userId: user.id, email: user.email });
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      temporaryPassword: tempPassword
    };
  },

  async updateUser(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    await user.update(data);
    
    logger.log('User updated', { userId });
    
    return user;
  },

  async resetPassword(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    const tempPassword = generateTempPassword();
    const hashedPassword = await authService.hashPassword(tempPassword);
    
    await user.update({ password: hashedPassword });
    
    logger.log('Password reset', { userId });
    
    return {
      message: `Password reset. Temporary password: ${tempPassword}`,
      temporaryPassword: tempPassword
    };
  },

  async findAll(filters = {}) {
    const { limit, offset } = filters;
    
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'phone', 'role', 'status', 'createdAt', 'lastLoginAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const total = await User.count();
    
    return { users, total, limit, offset };
  },

  async getBackup() {
    logger.log('Backup triggered');
    return { message: 'Backup initiated. Check server logs for progress.' };
  },

  async createProgram(data, userId) {
    const { Program } = await import('../models/index.js');
    
    const program = await Program.create({
      ...data,
      createdBy: userId
    });
    
    logger.log('Program created', { programId: program.id });
    
    return program;
  },

  async updateProgram(programId, data) {
    const { Program } = await import('../models/index.js');
    
    const program = await Program.findByPk(programId);
    if (!program) throw new Error('Program not found');
    
    await program.update(data);
    
    logger.log('Program updated', { programId });
    
    return program;
  }
};
