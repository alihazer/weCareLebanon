import asyncHandler from 'express-async-handler';
import Supplier from '../models/supplier.model.js';

// @desc get all suppliers
const getSuppliers = asyncHandler(async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        return res.status(200).json({
            status: true,
            data: suppliers
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc get single supplier
const getSupplier = asyncHandler(async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if(!supplier){
            res.status(404);
            throw new Error("Supplier not found");
        }
        return res.status(200).json({
            status: true,
            data: supplier
        });
    } catch (error) {
        
    }
});


// @desc add supplier
const createSupplier = asyncHandler(async (req, res) => {
    const { name,phone, address } = req.body;

    if(!name || !phone || !address){
        res.status(400);
        throw new Error("Please provide all fields");
    }
  
    try {
        const newSupplier = new Supplier({
            name,
            phone,
            address
        });
  
      await newSupplier.save();
  
      res.status(201).json({
        message: "Supplier created successfully",
        supplier: newSupplier,
    });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error('Validation Error');
        } else {
            res.status(500);
            throw new Error(error.message);
        }
    }
});

// @desc edit supplier
const editSupplier = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;
  
    try {
        const supplier = await Supplier.findById(req.params.id);
        if(!supplier){
            res.status(404);
            throw new Error("Supplier not found");
        }
        supplier.name = name;
        supplier.phone = phone;
        supplier.address = address;
  
        await supplier.save();
  
        res.status(200).json({
          message: "Supplier updated successfully",
          supplier: supplier,
      });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error('Validation Error');
        } else {
            res.status(500);
            throw new Error('Server Error');
        }
    }
});

// @desc delete supplier
const deleteSupplier = asyncHandler(async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if(!supplier){
            res.status(404);
            throw new Error("Supplier not found");
        }
        await supplier.remove();
        res.status(200).json({
            status: true,
            message: "Supplier deleted successfully"
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

export {
    getSuppliers,
    getSupplier,
    createSupplier,
    editSupplier,
    deleteSupplier
}