import express from 'express';
import { getCostStatistics, getInvoiceStatistics, getProfitStatistics, getTopProductsByMonth } from '../controllers/statistics.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';



const router = express.Router();

router.get('/profit', isLoggedIn, getProfitStatistics);
router.get('/invoice', isLoggedIn, getInvoiceStatistics);
router.get('/top-products', isLoggedIn, getTopProductsByMonth);
router.get('/costs', isLoggedIn, getCostStatistics);

export default router;
