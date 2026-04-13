import express from 'express';
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import memberRoutes from './members.js';
import feedbackRoutes from './feedback.js';
import dashboardRoutes from './dashboard.js';
import adminRoutes from './admin.js';
import templateRoutes from './templates.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/members', memberRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/templates', templateRoutes);

export default router;
