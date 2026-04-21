import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/users', authenticate, requirePermission(PERMISSIONS.USERS_VIEW_ALL), adminController.findAllUsers);
router.post('/users', authenticate, requirePermission(PERMISSIONS.USERS_CREATE), validate(schemas.createUser), adminController.createUser);
router.put('/users/:userId', authenticate, requirePermission(PERMISSIONS.USERS_EDIT), validate(schemas.updateUser), adminController.updateUser);
router.post('/users/:userId/reset-password', authenticate, requirePermission(PERMISSIONS.USERS_RESET_PASSWORD), adminController.resetPassword);
router.get('/backup', authenticate, requirePermission(PERMISSIONS.BACKUP_VIEW), adminController.getBackup);
router.post('/programs', authenticate, requirePermission(PERMISSIONS.PROGRAMS_MANAGE), validate(schemas.createProgram), adminController.createProgram);
router.put('/programs/:programId', authenticate, requirePermission(PERMISSIONS.PROGRAMS_MANAGE), adminController.updateProgram);

export default router;
