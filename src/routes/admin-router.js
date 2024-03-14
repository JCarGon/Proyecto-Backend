import { Router } from 'express';
import { getUsersController, getUserController, createUserAsAdminController, updateUserAsAdminController,
  deleteUserAsAdminController, historicalShoppingsController, userHistoricalShoppingsController } from '../controllers/admin-controller.js';
import { createFigureController, updateFigureController, deleteFigureController } from '../controllers/figure-controller.js';
import { getMessagesController, getMessageController } from '../controllers/message-controller.js';

const router = Router();

router.get('/users', getUsersController);
router.post('/users', createUserAsAdminController);
router.get('/users/:id', getUserController);
router.patch('/users/:id', updateUserAsAdminController);
router.delete('/users/:id', deleteUserAsAdminController);

router.get('/purchases', historicalShoppingsController);
router.get('/purchases/:id', userHistoricalShoppingsController);

router.post('/figures', createFigureController);
router.patch('/figures/:id', updateFigureController);
router.delete('/figures/:id', deleteFigureController);

router.get('/messages', getMessagesController);
router.get('/messages/:id', getMessageController);

export default router;
