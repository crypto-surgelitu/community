import express from 'express';
import { memberController } from '../controllers/memberController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/', authenticate, requirePermission(PERMISSIONS.MEMBERS_VIEW_ALL, PERMISSIONS.MEMBERS_VIEW_ZONE), memberController.findAll);
router.post('/', authenticate, requirePermission(PERMISSIONS.MEMBERS_CREATE), validate(schemas.createMember), memberController.create);
router.get('/:memberId', authenticate, requirePermission(PERMISSIONS.MEMBERS_VIEW_ALL, PERMISSIONS.MEMBERS_VIEW_ZONE), memberController.findById);
router.put('/:memberId', authenticate, requirePermission(PERMISSIONS.MEMBERS_EDIT), validate(schemas.updateMember), memberController.update);
router.delete('/:memberId', authenticate, requirePermission(PERMISSIONS.MEMBERS_DELETE), memberController.delete);
router.post('/bulk-import', authenticate, requirePermission(PERMISSIONS.MEMBERS_BULK_IMPORT), validate(schemas.bulkImportMembers), memberController.bulkImport);
router.get('/:memberId/timeline', authenticate, requirePermission(PERMISSIONS.MEMBERS_VIEW_TIMELINE), memberController.getTimeline);
router.post('/:memberId/message', authenticate, requirePermission(PERMISSIONS.MEMBERS_MESSAGE), validate(schemas.sendMessage), memberController.sendMessage);

export default router;
