import { Router } from 'express';
import { createUserAsAdminController, updateUserAsAdminController, deleteUserAsAdminController } from '../controllers/admin-controller';

const router = Router();

router.post('/createUser', createUserAsAdminController);
router.patch('/updateUser/:id', updateUserAsAdminController);
router.delete('/deleteUser/:id', deleteUserAsAdminController);

export default router;
