import { Op } from 'sequelize';
import { Feedback, Event, Member, Attendance } from '../models/index.js';
import { logger } from '../utils/logger.js';

export const feedbackService = {
  async submit(eventId, memberId, data) {
    const existing = await Feedback.findOne({
      where: { eventId, memberId }
    });
    
    if (existing) {
      await existing.update(data);
      logger.log('Feedback updated', { feedbackId: existing.id });
      return existing;
    }
    
    const feedback = await Feedback.create({
      ...data,
      eventId,
      memberId
    });
    
    logger.log('Feedback submitted', { feedbackId: feedback.id, eventId, memberId });
    
    return feedback;
  },

  async findByEvent(eventId) {
    const feedback = await Feedback.findAll({
      where: { eventId },
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name'] }
      ],
      order: [['submittedAt', 'DESC']]
    });
    
    const totalAttended = await Attendance.count({
      where: { eventId }
    });
    
    const analytics = await this.getAnalytics(eventId);
    
    return {
      feedbackList: feedback.map(f => ({
        id: f.id,
        member: f.member.name,
        rating: f.rating,
        sentiment: f.sentiment,
        text: f.textFeedback
      })),
      analytics: {
        ...analytics,
        totalAttended
      }
    };
  },

  async getAnalytics(eventId) {
    const feedback = await Feedback.findAll({
      where: { eventId }
    });
    
    const totalResponded = feedback.length;
    
    if (totalResponded === 0) {
      return {
        responseRate: 0,
        totalAttended: 0,
        totalResponded: 0,
        averageRating: 0,
        sentimentDistribution: {
          loved_it: 0,
          good: 0,
          ok: 0,
          didnt_enjoy: 0,
          hated_it: 0
        }
      };
    }
    
    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / totalResponded;
    
    const sentimentDistribution = {
      loved_it: feedback.filter(f => f.sentiment === 'loved_it').length,
      good: feedback.filter(f => f.sentiment === 'good').length,
      ok: feedback.filter(f => f.sentiment === 'ok').length,
      didnt_enjoy: feedback.filter(f => f.sentiment === 'didnt_enjoy').length,
      hated_it: feedback.filter(f => f.sentiment === 'hated_it').length
    };
    
    const totalAttended = await Attendance.count({ where: { eventId } });
    const responseRate = totalAttended > 0 ? totalResponded / totalAttended : 0;
    
    return {
      responseRate: Math.round(responseRate * 100) / 100,
      totalAttended,
      totalResponded,
      averageRating: Math.round(averageRating * 10) / 10,
      sentimentDistribution
    };
  },

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.eventId) where.eventId = filters.eventId;
    if (filters.rating) where.rating = filters.rating;
    if (filters.sentiment) where.sentiment = filters.sentiment;
    if (filters.dateFrom || filters.dateTo) {
      where.submittedAt = {};
      if (filters.dateFrom) where.submittedAt[Op.gte] = filters.dateFrom;
      if (filters.dateTo) where.submittedAt[Op.lte] = filters.dateTo;
    }
    
    const { limit, offset } = filters;
    
    const feedback = await Feedback.findAll({
      where,
      include: [
        { model: Event, as: 'event', attributes: ['id', 'title', 'eventDate'] },
        { model: Member, as: 'member', attributes: ['id', 'name'] }
      ],
      order: [['submittedAt', 'DESC']],
      limit,
      offset
    });
    
    const total = await Feedback.count({ where });
    
    return { feedback, total, limit, offset };
  }
};
