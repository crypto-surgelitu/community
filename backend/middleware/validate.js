import Joi from 'joi';
import { logger } from './logger.js';

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation error', { error: errorMessage });
      return res.status(400).json({
        error: errorMessage,
        status: 400
      });
    }
    
    req.validatedBody = value;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Query validation error', { error: errorMessage });
      return res.status(400).json({
        error: errorMessage,
        status: 400
      });
    }
    
    req.validatedQuery = value;
    next();
  };
}
