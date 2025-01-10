import asyncHandler from 'express-async-handler';
import Category from '../models/category.model.js';

// @desc get all categories
const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc get single category
const getCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            res.status(404);
            throw new Error("Category not found");
        }
        return res.status(200).json({
            status: true,
            data: category
        });
    } catch (error) {
        
    }
});

// @desc add category
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if(!name){
        res.status(400);
        throw new Error("Please provide category name");
    }
  
    try {
        const newCategory = new Category({
            name
        });
  
      await newCategory.save();
  
      res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
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

const editCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
  
    try {
        const category = await Category.findById(req.params.id);
  
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
  
        category.name = name;
  
        await category.save();
  
        res.status(200).json({
            message: 'Category updated successfully',
            category: category,
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

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
  
        await Category.findByIdAndDelete(req.params.id);
  
        res.status(200).json({
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
});

export { createCategory, deleteCategory, editCategory, getCategories, getCategory };
