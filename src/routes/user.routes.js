import express from 'express';
import { getAddUserForm, addUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/add', getAddUserForm);
router.post('/addUser', addUser)

export default router;