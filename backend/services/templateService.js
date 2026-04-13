import { Template, User } from '../models/index.js';
import { logger } from '../utils/logger.js';

export const templateService = {
  async create(data, userId) {
    const template = await Template.create({
      ...data,
      createdBy: userId
    });
    
    logger.log('Template created', { templateId: template.id });
    
    return template;
  },

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.category) where.category = filters.category;
    
    const { limit, offset } = filters;
    
    const templates = await Template.findAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const total = await Template.count({ where });
    
    return { templates, total, limit, offset };
  },

  async findById(templateId) {
    const template = await Template.findByPk(templateId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });
    
    return template;
  },

  async update(templateId, data) {
    const template = await Template.findByPk(templateId);
    if (!template) throw new Error('Template not found');
    
    await template.update(data);
    
    logger.log('Template updated', { templateId });
    
    return template;
  },

  async delete(templateId) {
    const template = await Template.findByPk(templateId);
    if (!template) throw new Error('Template not found');
    
    await template.destroy();
    
    logger.log('Template deleted', { templateId });
    
    return { message: 'Template deleted successfully' };
  }
};
