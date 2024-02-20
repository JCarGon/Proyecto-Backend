import { Router } from 'express';
import { getFiguresController, getFigureController } from '../controllers/figure-controller.js';

const router = Router();

router.get('/', getFiguresController); //Add filters
router.get('/:id', getFigureController);

export default router;
