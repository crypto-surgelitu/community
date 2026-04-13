import { feedbackService } from '../services/feedbackService.js';

export const feedbackController = {
  async submit(req, res, next) {
    try {
      const { eventId } = req.params;
      const { memberId, rating, sentiment, textFeedback } = req.validatedBody;
      
      const feedback = await feedbackService.submit(eventId, memberId, {
        rating,
        sentiment,
        textFeedback
      });
      
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  },

  async findByEvent(req, res, next) {
    try {
      const result = await feedbackService.findByEvent(req.params.eventId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getAnalytics(req, res, next) {
    try {
      const analytics = await feedbackService.getAnalytics(req.params.eventId);
      const event = await (await import('../models/index.js')).Event.findByPk(req.params.eventId);
      
      res.status(200).json({
        eventId: req.params.eventId,
        eventTitle: event?.title,
        ...analytics,
        averageRatingStars: '★'.repeat(Math.round(analytics.averageRating)) + '☆'.repeat(5 - Math.round(analytics.averageRating)),
        sentimentDistribution: Object.entries(analytics.sentimentDistribution).reduce((acc, [key, count]) => {
          acc[key] = {
            count,
            percentage: analytics.totalResponded > 0 ? Math.round(count / analytics.totalResponded * 100) : 0
          };
          return acc;
        }, {}),
        topThemes: [],
        recentFeedback: []
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const filters = {
        eventId: req.query.eventId,
        rating: req.query.rating ? parseInt(req.query.rating) : undefined,
        sentiment: req.query.sentiment,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const result = await feedbackService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
