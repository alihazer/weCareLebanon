import express from 'express';
import { createInvoice, getAllInvoices, getCustomerInvoices, showInvoice } from '../controllers/invoice.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.post('/addOrder',isLoggedIn,  createInvoice);
router.get('/customer/:id', isLoggedIn, getCustomerInvoices)
router.get('/all', isLoggedIn, getAllInvoices)
router.get('/invoice/:id', isLoggedIn, showInvoice)

export default router;