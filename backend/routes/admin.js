import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/users', authenticate, authorize(ROLES.ADMIN), adminController.findAllUsers);
router.post('/users', authenticate, authorize(ROLES.ADMIN), validate(schemas.createUser), adminController.createUser);
router.put('/users/:userId', authenticate, authorize(ROLES.ADMIN), validate(schemas.updateUser), adminController.updateUser);
router.post('/users/:userId/reset-password', authenticate, authorize(ROLES.ADMIN), adminController.resetPassword);
router.get('/backup', authenticate, authorize(ROLES.ADMIN), adminController.getBackup);
router.post('/programs', authenticate, authorize(ROLES.ADMIN), validate(schemas.createProgram), adminController.createProgram);
router.put('/programs/:programId', authenticate, authorize(ROLES.ADMIN), adminController.updateProgram);

export default router;
