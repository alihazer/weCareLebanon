import express from 'express';
import { addUser, getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/add', addUser);
router.get('/all', getAllUsers);    

export default router;