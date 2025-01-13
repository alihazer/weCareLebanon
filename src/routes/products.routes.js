import express from 'express';
import { getProducts, createProduct, editProduct, deleteProduct} from '../controllers/products.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import multer from 'multer';

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get('/', /*isLoggedIn,*/ getProducts);
router.post('/add',/*isLoggedIn,*/ upload.single('image') ,createProduct);
router.put('/edit/:id', /*isLoggedIn ,*/editProduct);
router.delete('/delete/:id',/*isLoggedIn,*/deleteProduct);



export default router;