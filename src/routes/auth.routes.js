import express from 'express';
import { getLoginForm, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', getLoginForm);
router.post('/', login);

export default router;