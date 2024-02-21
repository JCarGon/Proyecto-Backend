import express from 'express';
import { adminChecker } from '../middlewares/admin-middleware.js';
import { checkToken } from '../middlewares/auth-middleware.js';
import { login } from '../controllers/login-controller.js';
import { deleteTokenController } from '../controllers/user-controller.js';
import { createUserController } from '../controllers/user-controller.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';
import adminRouter from './admin-router.js';
import figureRouter from './figure-router.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', checkToken, deleteTokenController);
router.post('/users', createUserController);
router.use('/users', checkToken, userRouter);
router.use('/admin', checkToken, adminChecker, adminRouter);
router.use('/figures', figureRouter);

router.use(miscRouter);

export default router;
