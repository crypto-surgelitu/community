import express from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/', authenticate, requirePermission(PERMISSIONS.FEEDBACK_VIEW_ALL, PERMISSIONS.FEEDBACK_VIEW_ZONE), feedbackController.findAll);
router.post('/:eventId/feedback', validate(schemas.submitFeedback), feedbackController.submit);
router.get('/:eventId/feedback', authenticate, requirePermission(PERMISSIONS.FEEDBACK_VIEW_ALL, PERMISSIONS.FEEDBACK_VIEW_ZONE), feedbackController.findByEvent);
router.get('/:eventId/feedback/analytics', authenticate, requirePermission(PERMISSIONS.FEEDBACK_VIEW_ALL, PERMISSIONS.FEEDBACK_VIEW_ZONE), feedbackController.getAnalytics);

export default router;
