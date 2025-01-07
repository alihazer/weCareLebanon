import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';

// @desc get all products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            status: true,
            data: products
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc get single product
const getProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }
        return res.status(200).json({
            status: true,
            data: product
        });
    } catch (error) {
        
    }
});

// @desc add product
const createProduct = asyncHandler(async (req, res) => {
    const { name, category_id, code, details, purchasePrice, wholeSalePrice, singlePrice, supplierId, quantity, image } = req.body;
  
    try {
        const newProduct = new Product({
            name,
            category_id,
            code,
            details,
            purchasePrice,
            wholeSalePrice,
            singlePrice,
            supplierId,
            quantity,
            image,
        });
  
      await newProduct.save();
  
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
    });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "An error occurred while creating the product",
            error: error.message,
        });
    }
});
  
export {createProduct, getProducts, getProduct};