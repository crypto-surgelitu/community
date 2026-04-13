import express from 'express';
import { templateController } from '../controllers/templateController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { schemas } from '../utils/validators.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', authenticate, templateController.findAll);
router.post('/', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.createTemplate), templateController.create);
router.get('/:templateId', authenticate, templateController.findById);
router.put('/:templateId', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), validate(schemas.createTemplate), templateController.update);
router.delete('/:templateId', authenticate, authorize(ROLES.CASE_MANAGER, ROLES.COMMUNITY_MANAGER, ROLES.ADMIN), templateController.delete);

export default router;
