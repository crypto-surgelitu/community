import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/metrics', authenticate, requirePermission(PERMISSIONS.DASHBOARD_VIEW_ALL, PERMISSIONS.DASHBOARD_VIEW_ZONE), dashboardController.getMetrics);
router.get('/programs', authenticate, requirePermission(PERMISSIONS.DASHBOARD_VIEW_ALL, PERMISSIONS.DASHBOARD_VIEW_ZONE), dashboardController.getPrograms);
router.get('/at-risk-members', authenticate, requirePermission(PERMISSIONS.DASHBOARD_VIEW_ALL, PERMISSIONS.DASHBOARD_VIEW_ZONE), dashboardController.getAtRiskMembers);
router.get('/zones', authenticate, requirePermission(PERMISSIONS.DASHBOARD_VIEW_ALL, PERMISSIONS.DASHBOARD_VIEW_ZONE), dashboardController.getZones);

export default router;
