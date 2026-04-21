import crypto from 'crypto';
import { sendEmail, emailTemplates } from './emailService.js';
import { logger } from './logger.js';

const otpStore = new Map();

const OTP_EXPIRY = 15 * 60 * 1000;

export const generateOTP = (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + OTP_EXPIRY;
  
  otpStore.set(email, { otp, expiresAt });
  
  logger.log('OTP generated', { email });
  return otp;
};

export const verifyOTP = (email, inputOtp) => {
  const record = otpStore.get(email);
  
  if (!record) {
    return { valid: false, error: 'OTP not found or expired' };
  }
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { valid: false, error: 'OTP expired' };
  }
  
  if (record.otp !== inputOtp) {
    return { valid: false, error: 'Invalid OTP' };
  }
  
  otpStore.delete(email);
  return { valid: true };
};

export const requestOTP = async (email, name, type = 'verification') => {
  const otp = generateOTP(email);
  
  let template;
  if (type === 'password_reset') {
    template = emailTemplates.passwordReset({ name, email }, otp);
  } else {
    template = emailTemplates.verification(name, email, otp);
  }
  
  const result = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
  
  return result;
};

export const clearOTP = (email) => {
  otpStore.delete(email);
};