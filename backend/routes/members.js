import express from 'express';
import { memberController } from '../controllers/memberController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', authenticate, memberController.findAll);
router.post('/', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.createMember), memberController.create);
router.get('/:memberId', authenticate, memberController.findById);
router.put('/:memberId', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.updateMember), memberController.update);
router.delete('/:memberId', authenticate, authorize(ROLES.ADMIN), memberController.delete);
router.post('/bulk-import', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.bulkImportMembers), memberController.bulkImport);
router.get('/:memberId/timeline', authenticate, memberController.getTimeline);
router.post('/:memberId/message', authenticate, validate(schemas.sendMessage), memberController.sendMessage);

export default router;
