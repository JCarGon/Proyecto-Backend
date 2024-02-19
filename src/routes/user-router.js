import { Router } from 'express';
import { getUsersController, getUserController, createUserController, deleteUserController, getUserMe, updateUserController, deleteTokenController } from '../controllers/user-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';
import { validatorUserId } from '../middlewares/userValidator-middleware.js';

const router = Router();

router.get('/', getUsersController);
router.get('/:id', getUserController);
router.get('/me', checkToken, getUserMe);
router.post('/', createUserController);
router.delete('/:id', checkToken, validatorUserId ,deleteUserController);
router.patch('/:id', checkToken, validatorUserId, updateUserController);
router.post('/logout', checkToken, deleteTokenController);

export default router;
