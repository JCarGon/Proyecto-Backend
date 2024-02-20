import { Router } from 'express';
import { getUserMe, createUserController, deleteMeController, updateMeController, addFigureToCartController, removeFigureFromCartController } from '../controllers/user-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = Router();

router.get('/me', checkToken, getUserMe);
router.post('/', createUserController);
router.patch('/me', checkToken, updateMeController);
router.delete('/me', checkToken, deleteMeController);
router.post('/figures/:id', checkToken, addFigureToCartController); //usar req.user.id y id de /anime/figures/:id
router.delete('/figures/:id', checkToken, removeFigureFromCartController); //TO DO

export default router;
