import express from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/', authenticate, requirePermission(PERMISSIONS.EVENTS_VIEW_ALL, PERMISSIONS.EVENTS_VIEW_ZONE), eventController.findAll);
router.post('/', authenticate, requirePermission(PERMISSIONS.EVENTS_CREATE), validate(schemas.createEvent), eventController.create);
router.get('/:eventId', authenticate, requirePermission(PERMISSIONS.EVENTS_VIEW_ALL, PERMISSIONS.EVENTS_VIEW_ZONE), eventController.findById);
router.put('/:eventId', authenticate, requirePermission(PERMISSIONS.EVENTS_EDIT_ALL, PERMISSIONS.EVENTS_EDIT_OWN), validate(schemas.updateEvent), eventController.update);
router.delete('/:eventId', authenticate, requirePermission(PERMISSIONS.EVENTS_DELETE), eventController.delete);
router.post('/:eventId/publish', authenticate, requirePermission(PERMISSIONS.EVENTS_EDIT_ALL, PERMISSIONS.EVENTS_EDIT_OWN), eventController.publish);
router.post('/:eventId/checkin', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_CREATE), validate(schemas.checkIn), eventController.checkIn);
router.get('/:eventId/attendance', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_VIEW), eventController.getAttendance);

export default router;
