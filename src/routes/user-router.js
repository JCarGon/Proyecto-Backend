import { Router } from 'express';
import { getUserMe, deleteMeController, updateMeController, addFigureToCartController, removeFigureFromCartController, confirmOrderController } from '../controllers/user-controller.js';

const router = Router();

router.get('/me', getUserMe);
router.patch('/me', updateMeController);
router.delete('/me', deleteMeController);
router.post('/figures/:id', addFigureToCartController);
router.delete('/figures/:id', removeFigureFromCartController);
router.post('/confirmOrder', confirmOrderController);

export default router;
