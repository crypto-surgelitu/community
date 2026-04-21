import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { otpController } from '../controllers/otpController.js';
import { authService } from '../services/authService.js';
import { User } from '../models/index.js';

const router = express.Router();

router.post('/login', validate(schemas.login), authController.login);
router.post('/signup', validate(schemas.signup), authController.signup);
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, validate(schemas.changePassword), authController.changePassword);
router.post('/forgot-password', otpController.requestResetOTP);
router.post('/verify-otp', otpController.verifyResetOTP);
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await authService.hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
