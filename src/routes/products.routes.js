import express from 'express';
import { getProducts,getProduct, createProduct, editProduct, deleteProduct, getProductStats, createQuotation, createTextQuotation} from '../controllers/products.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import multer from 'multer';
import optionalUpload from '../middlewares/optionalUpload.js';

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get('/', isLoggedIn, getProducts);
router.get('/:id', isLoggedIn, getProduct);
router.post('/add',isLoggedIn, upload.single('image') ,createProduct);
router.put('/edit/:id', isLoggedIn, optionalUpload ,editProduct);
router.delete('/delete/:id',isLoggedIn,deleteProduct);
router.get('/stats/:id', isLoggedIn, getProductStats);
router.post('/quotation/create-quotation', isLoggedIn, createQuotation);
router.post('/quotation/create-text-quotation', isLoggedIn, createTextQuotation);



export default router;