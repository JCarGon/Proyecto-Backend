import { Router } from 'express';
import { getUsersController, getUserController, createUserAsAdminController, updateUserAsAdminController, deleteUserAsAdminController } from '../controllers/admin-controller.js';
import { createFigureController, updateFigureController, deleteFigureController } from '../controllers/figure-controller.js';

const router = Router();

router.get('/users', getUsersController);
router.get('/:id', getUserController);
router.post('/users', createUserAsAdminController);
router.patch('/users/:id', updateUserAsAdminController);
router.delete('/users/:id', deleteUserAsAdminController);

router.post('/figures', createFigureController);
router.patch('/figures/:id', updateFigureController);
router.delete('/figures/:id', deleteFigureController);

export default router;
