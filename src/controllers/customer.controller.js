import asyncHandler from 'express-async-handler';
import Customer from '../models/customer.model.js';

// @desc    Fetch all customers
// @route   GET /api/customers

const getCustomers = asyncHandler(async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.status(200).json({
            status: true,
            message: "Customers retrieved successfully",
            data: customers
        })
    } catch (error) {
        res.status = 500;
        throw new Error(error.message);
    }
});

// @desc    Fetch single customer
// @route   GET /api/customers/:id

const getCustomer = asyncHandler(async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            return res.status(200).json({
                status: true,
                message: "Customer retrieved successfully",
                data: customer
            })
        } else {
            res.status = 404;
            throw new Error('Customer not found');
        }
    } catch (error) {
        res.status = 500;
        throw new Error(error.message);
    }
});


// @desc    Create a customer
// @route   POST /api/customers

const createCustomer = asyncHandler(async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        if(!name || !phone || !address) {
            res.status = 400;
            throw new Error('All fields are required');
        }
        const customer = new Customer({ name, phone, address });
        const createdCustomer = await customer.save();
        return res.status(201).json({
            status: true,
            message: "Customer created successfully",
            data: createdCustomer
        })
    } catch (error) {
        res.status = 500;
        throw new Error(error.message);
    }
});

// @desc    Update a customer
// @route   PUT /api/customers/:id

const updateCustomer = asyncHandler(async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        if(!name || !phone || !address) {
            res.status = 400;
            throw new Error('All fields are required');
        }
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            customer.name = name;
            customer.phone = phone;
            customer.address = address;
            const updatedCustomer = await customer.save();
            return res.status(200).json({
                status: true,
                message: "Customer updated successfully",
                data: updatedCustomer
            })
        } else {
            res.status = 404;
            throw new Error('Customer not found');
        }
    } catch (error) {
        res.status = 500;
        throw new Error(error.message);
    }
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id

const deleteCustomer = asyncHandler(async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            await customer.remove();
            return res.status(200).json({
                status: true,
                message: "Customer deleted successfully",
            })
        } else {
            res.status = 404;
            throw new Error('Customer not found');
        }
    } catch (error) {
        res.status = 500;
        throw new Error(error.message);
    }
});

export { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };

