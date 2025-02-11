// Imports
import * as controller from '@/controllers/admin.controller';
import { Router } from 'express';

const router = Router();

router.get('/', controller.getAdmins);

// Export
export default router;