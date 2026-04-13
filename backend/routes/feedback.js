import express from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';

const router = express.Router();

router.get('/', authenticate, feedbackController.findAll);
router.post('/:eventId/feedback', validate(schemas.submitFeedback), feedbackController.submit);
router.get('/:eventId/feedback', authenticate, feedbackController.findByEvent);
router.get('/:eventId/feedback/analytics', authenticate, feedbackController.getAnalytics);

export default router;
