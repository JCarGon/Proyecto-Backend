import { Router } from 'express';
import { getUsersController, createUserController, deleteUserController, getUserMe, updateUserController } from '../controllers/user-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = Router();

router.get('/', getUsersController);
router.get('/me', checkToken, getUserMe);
router.post('/', createUserController);
router.delete('/:id', checkToken, deleteUserController);
router.patch('/:id', checkToken, updateUserController);

export default router;
