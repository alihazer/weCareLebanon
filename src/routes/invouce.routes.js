import express from 'express';
import { createInvoice } from '../controllers/invoice.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.post('/addOrder',isLoggedIn,  createInvoice);

export default router;