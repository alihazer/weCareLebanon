import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/add', createCustomer);
router.put('/edit/:id', updateCustomer);
router.delete('/delete/:id', deleteCustomer);

export default router;