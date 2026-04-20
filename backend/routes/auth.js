import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';

const router = express.Router();

router.post('/login', validate(schemas.login), authController.login);
router.post('/signup', validate(schemas.signup), authController.signup);
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, validate(schemas.changePassword), authController.changePassword);

export default router;
