import express from 'express';
import { addUser, getAllUsers ,deleteUser, getUserById, updateUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);    
router.post('/add', addUser);
router.delete('/delete/:id', deleteUser);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);

export default router;