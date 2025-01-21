import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/',isLoggedIn, getCustomers);
router.get('/:id',isLoggedIn, getCustomer);
router.post('/add', isLoggedIn,createCustomer);
router.put('/edit/:id',isLoggedIn, updateCustomer);
router.delete('/delete/:id',isLoggedIn, deleteCustomer);

export default router;