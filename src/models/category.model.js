import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Category name is required"], minlength: [3, "Category name must be at least 3 characters long"] 
},
},{timestamps: true});

const Category = mongoose.model('Category', categorySchema);
export default Category;