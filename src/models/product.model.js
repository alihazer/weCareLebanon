import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    code: { type: String, required: true },
    details: { type: String },
    purchasePrice: { type: Number, required: true },
    wholeSalePrice: { type: Number, required: true },
    singlePrice: { type: Number, required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;