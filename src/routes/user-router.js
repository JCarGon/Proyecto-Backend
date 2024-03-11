import { Router } from 'express';
import { getUserMe, deleteMeController, updateMeController } from '../controllers/user-controller.js';

const router = Router();

router.get('/me', getUserMe);
router.patch('/me', updateMeController);
router.delete('/me', deleteMeController);

export default router;
