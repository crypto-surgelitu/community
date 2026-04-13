import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { logger } from './logger.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided', status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      logger.debug('Authenticated user', { userId: decoded.id, role: decoded.role });
      next();
    } catch (jwtError) {
      logger.warn('Invalid token attempt', { error: jwtError.message });
      return res.status(401).json({ error: 'Invalid token', status: 401 });
    }
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    return res.status(401).json({ error: 'Authentication failed', status: 401 });
  }
}
