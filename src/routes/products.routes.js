import express from 'express';
import { getProducts, createProduct, editProduct, deleteProduct} from '../controllers/products.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/', /*isLoggedIn,*/ getProducts);
router.post('/add', isLoggedIn ,createProduct);
router.put('/edit/:id', isLoggedIn ,editProduct);
router.delete('/delete/:id', isLoggedIn ,deleteProduct);



export default router;