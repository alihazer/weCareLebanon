import express from 'express';
import { getCategories, getCategory, createCategory } from '../controllers/category.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/', isLoggedIn ,getCategories);
router.get('/:id', isLoggedIn ,getCategory);
router.post('/add', isLoggedIn ,createCategory);

export default router;