import express from 'express';
import { otpController } from '../controllers/otpController.js';

const router = express.Router();

router.post('/request-reset', otpController.requestResetOTP);
router.post('/verify-reset', otpController.verifyResetOTP);

export default router;