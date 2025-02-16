import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCost, deleteCost, getCostById, getCosts, updateCost } from '../controllers/cost.controller.js';


const router = express.Router();
router.get('/', isLoggedIn, getCosts);
router.get('/:id', isLoggedIn, getCostById);
router.post('/', isLoggedIn, createCost);
router.put('/:id', isLoggedIn, updateCost);
router.delete('/:id', isLoggedIn, deleteCost);

export default router;