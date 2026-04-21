import nodemailer from 'nodemailer';
import { config } from '../config/environment.js';
import { logger } from './logger.js';

let transporter = null;

export const initEmailService = () => {
  if (!config.email.host || !config.email.user || !config.email.password) {
    logger.warn('Email service not configured - SMTP credentials missing');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });

  logger.log('Email service initialized', { host: config.email.host });
  return transporter;
};

export const getTransporter = () => {
  if (!transporter) {
    transporter = initEmailService();
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, text, html, cc, bcc, attachments }) => {
  if (!transporter) {
    transporter = initEmailService();
  }

  if (!transporter) {
    logger.warn('Email not sent - service not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.user,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments
    });

    logger.log('Email sent', { messageId: info.messageId, to });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed', { error: error.message, to });
    return { success: false, error: error.message };
  }
};

export const sendBulkEmails = async (emails) => {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );
  return results.map((r, i) => ({
    ...emails[i],
    ...(r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
  }));
};

export const emailTemplates = {
  welcome: (name, email) => ({
    to: email,
    subject: 'Welcome to Swahilipot Hub Community',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Swahilipot Hub!</h1>
        <p>Hi ${name},</p>
        <p>Welcome to our community management platform. We're excited to have you on board!</p>
        <p>Your account has been created. You can now:</p>
        <ul>
          <li>Manage community members</li>
          <li>Track events and activities</li>
          <li>Generate reports</li>
        </ul>
        <p>Best regards,<br>The Swahilipot Hub Team</p>
      </div>
    `
  }),

  passwordReset: (name, resetToken) => ({
    to: name.email || name,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>Hi ${name.name},</p>
        <p>You requested a password reset. Use the token below:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 18px; text-align: center;">
          ${resetToken}
        </div>
        <p>This token expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  }),

  eventReminder: (memberName, eventDetails) => ({
    to: memberName.email,
    subject: `Reminder: ${eventDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Event Reminder</h1>
        <p>Hi ${memberName.name},</p>
        <p>This is a reminder for the upcoming event:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
          <p><strong>Title:</strong> ${eventDetails.title}</p>
          <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${eventDetails.location || 'TBA'}</p>
        </div>
        <p>We hope to see you there!</p>
      </div>
    `
  }),

  accountCreated: (name, email, tempPassword) => ({
    to: email,
    subject: 'Your Account Has Been Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Swahilipot Hub!</h1>
        <p>Hi ${name},</p>
        <p>Your account has been created. Here are your login credentials:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p style="margin-top: 16px;">Please change your password after logging in.</p>
        <p>Login at: <a href="http://localhost:5173/login">http://localhost:5173/login</a></p>
        <p>Best regards,<br>The Swahilipot Hub Team</p>
      </div>
    `
  }),

  passwordResetNotification: (name, email, newPassword) => ({
    to: email,
    subject: 'Your Password Has Been Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>Your password has been reset. Here are your new credentials:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>New Password:</strong> ${newPassword}</p>
        </div>
        <p style="margin-top: 16px;">If you didn't request this, please contact support immediately.</p>
        <p>Best regards,<br>The Swahilipot Hub Team</p>
      </div>
    `
  }),

  verification: (name, email, otp) => ({
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Verification Code</h1>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 28px; text-align: center; letter-spacing: 8px;">
          ${otp}
        </div>
        <p>This code expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  })
};