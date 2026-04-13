import { memberService } from '../services/memberService.js';

export const memberController = {
  async create(req, res, next) {
    try {
      const member = await memberService.create({
        ...req.validatedBody,
        createdBy: req.user.id
      });
      res.status(201).json(member);
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async findAll(req, res, next) {
    try {
      const filters = {
        zoneId: req.query.zone,
        engagement: req.query.engagement,
        status: req.query.status,
        search: req.query.search,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const result = await memberService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const member = await memberService.findById(req.params.memberId);
      if (!member) {
        return res.status(404).json({ error: 'Member not found', status: 404 });
      }
      res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const member = await memberService.update(req.params.memberId, req.body);
      res.status(200).json(member);
    } catch (error) {
      if (error.message === 'Member not found' || error.message.includes('already in use')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async delete(req, res, next) {
    try {
      const result = await memberService.delete(req.params.memberId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Member not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async bulkImport(req, res, next) {
    try {
      const { members } = req.validatedBody;
      const result = await memberService.bulkImport(members, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      if (error.message.includes('Maximum')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async getTimeline(req, res, next) {
    try {
      const timeline = await memberService.getTimeline(req.params.memberId);
      res.status(200).json({ timeline });
    } catch (error) {
      next(error);
    }
  },

  async sendMessage(req, res, next) {
    try {
      const { message, templateId } = req.validatedBody;
      const result = await memberService.sendMessage(
        req.params.memberId,
        message,
        templateId,
        req.user.id
      );
      res.status(202).json(result);
    } catch (error) {
      if (error.message === 'Member not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  }
};
