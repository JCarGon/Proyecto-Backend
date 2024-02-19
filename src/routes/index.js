import express from 'express';
import { adminChecker } from '../middlewares/admin-middleware.js';
import { checkToken } from '../middlewares/auth-middleware.js';
import { login } from '../controllers/login-controller.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';
import adminRouter from './admin-routes.js';

const router = express.Router();

router.post('/login', login);
router.use('/users', userRouter);
router.use('/admin', checkToken, adminChecker, adminRouter);

router.use(miscRouter);

export default router;
