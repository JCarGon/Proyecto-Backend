import express from 'express';
import { login } from '../controllers/login-controller.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';

const router = express.Router();

router.post('/v1/login', login);
router.use('/v1/users', userRouter);

router.use(miscRouter);

export default router;
