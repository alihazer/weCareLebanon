import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';

// @desc get all products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const { category } = req.query;
        
        let filter = {};
        if (category) {
            filter.category_id = category;
        }
        if (req.query.quantity === 'gt0') {
            filter.quantity = { $gt: 0 };
        }
        
        const products = await Product.find(filter).populate('supplierId', 'name');
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
    cloudinary.config({
        cloud_name: process.env.cloudinary_cloud_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret,
    });

    const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
  
      const result = await uploadFromBuffer(req.file.buffer);

    
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
            image: result.secure_url,
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
        res.status(500);
        throw new Error(error.message);
    }
});

const editProduct = asyncHandler(async (req, res) => {
    const { name, category_id, code, details, purchasePrice, wholeSalePrice, singlePrice, supplierId, quantity } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        product.name = name;
        product.category_id = category_id;
        product.code = code;
        product.details = details;
        product.purchasePrice = purchasePrice;
        product.wholeSalePrice = wholeSalePrice;
        product.singlePrice = singlePrice;
        product.supplierId = supplierId;
        product.quantity = quantity;

        if (req.file) {
            cloudinary.config({
                cloud_name: process.env.cloudinary_cloud_name,
                api_key: process.env.cloudinary_api_key,
                api_secret: process.env.cloudinary_api_secret,
            });

            const uploadFromBuffer = (buffer) =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'products' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });

            const result = await uploadFromBuffer(req.file.buffer);
            product.image = result.secure_url;
        }

        await product.save();

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "An error occurred while updating the product",
            error: error.message,
        });
        console.log(error);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the product",
            error: error.message,
        });
    }
});
  
export {createProduct, getProducts, getProduct, editProduct, deleteProduct};