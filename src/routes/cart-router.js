import { Router } from 'express';
import { addFigureToCartController, removeFigureFromCartController, confirmOrderController } from '../controllers/user-controller.js';

const router = Router();

router.post('/confirmOrder', confirmOrderController);
router.post('/:id', addFigureToCartController);
router.delete('/:id', removeFigureFromCartController);

export default router;
