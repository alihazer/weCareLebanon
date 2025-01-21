import express from 'express';
import { getLoginForm, login ,logout} from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', getLoginForm);
router.post('/login', login);
router.post('/logout', logout);

export default router;