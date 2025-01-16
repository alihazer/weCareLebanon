import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    isWholeSale: { type: Boolean, required: true },
},{timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;