import { Router } from 'express';
import { getUserMe, deleteMeController, updateMeController, historicalShoppingsController } from '../controllers/user-controller.js';

const router = Router();

router.get('/me', getUserMe);
router.patch('/me', updateMeController);
router.delete('/me', deleteMeController);

router.get('/me/purchases', historicalShoppingsController);

export default router;
