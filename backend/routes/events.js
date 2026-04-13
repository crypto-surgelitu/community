import express from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', authenticate, eventController.findAll);
router.post('/', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.createEvent), eventController.create);
router.get('/:eventId', authenticate, eventController.findById);
router.put('/:eventId', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.updateEvent), eventController.update);
router.delete('/:eventId', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), eventController.delete);
router.post('/:eventId/publish', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), eventController.publish);
router.post('/:eventId/checkin', authenticate, validate(schemas.checkIn), eventController.checkIn);
router.get('/:eventId/attendance', authenticate, eventController.getAttendance);

export default router;
