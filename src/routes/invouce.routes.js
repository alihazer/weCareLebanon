import express from 'express';
import { createInvoice, getAllInvoices, getCustomerInvoices, refundInvoice, showInvoice } from '../controllers/invoice.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.post('/addOrder',isLoggedIn,  createInvoice);
router.get('/customer/:id', isLoggedIn, getCustomerInvoices)
router.get('/all', isLoggedIn, getAllInvoices)
router.get('/invoice/:id', isLoggedIn, showInvoice)
router.post('/refund-invoice', isLoggedIn, refundInvoice);

export default router;