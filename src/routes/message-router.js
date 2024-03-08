import { Router } from 'express';
import { createMessageController } from '../controllers/message-controller.js';

const router = Router();

router.post('/', createMessageController);

export default router;
