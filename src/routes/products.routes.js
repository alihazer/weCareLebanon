import express from 'express';
import { getProducts, createProduct } from '../controllers/products.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/', isLoggedIn ,getProducts);
router.post('/add', isLoggedIn ,createProduct);



export default router;