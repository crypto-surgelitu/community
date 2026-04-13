import { templateService } from '../services/templateService.js';

export const templateController = {
  async create(req, res, next) {
    try {
      const template = await templateService.create(req.validatedBody, req.user.id);
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const result = await templateService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const template = await templateService.findById(req.params.templateId);
      if (!template) {
        return res.status(404).json({ error: 'Template not found', status: 404 });
      }
      res.status(200).json(template);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const template = await templateService.update(req.params.templateId, req.body);
      res.status(200).json(template);
    } catch (error) {
      if (error.message === 'Template not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async delete(req, res, next) {
    try {
      const result = await templateService.delete(req.params.templateId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Template not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  }
};
