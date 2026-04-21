import { User } from '../models/index.js';
import { requestOTP, verifyOTP } from '../utils/otpService.js';
import { logger } from '../utils/logger.js';

export const otpController = {
  async requestResetOTP(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await requestOTP(email, user.name, 'password_reset');
      
      res.json({ message: 'OTP sent to your email' });
    } catch (error) {
      logger.error('OTP request failed', { error: error.message });
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  },

  async verifyResetOTP(req, res) {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }
      
      const result = verifyOTP(email, otp);
      
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      logger.error('OTP verification failed', { error: error.message });
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  }
};