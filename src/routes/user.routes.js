import express from 'express';
import { addUser, getAllUsers ,deleteUser, getUserById, updateUser} from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/',isLoggedIn, getAllUsers);    
router.get('/:id',isLoggedIn, getUserById);
router.post('/add',isLoggedIn, addUser);
router.put('/update/:id',isLoggedIn, updateUser);
router.delete('/delete/:id',isLoggedIn, deleteUser);

export default router;