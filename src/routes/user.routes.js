import express from 'express';
import { addUser, getAllUsers ,deleteUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);    
router.post('/add', addUser);
router.delete('/delete/:id', deleteUser);

export default router;