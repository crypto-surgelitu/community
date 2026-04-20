import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/metrics', authenticate, dashboardController.getMetrics);
router.get('/programs', authenticate, dashboardController.getPrograms);
router.get('/at-risk-members', authenticate, dashboardController.getAtRiskMembers);
router.get('/zones', authenticate, dashboardController.getZones);

export default router;
