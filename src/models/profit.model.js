import mongoose from "mongoose";

const profitSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    totalProfit: { type: Number, required: true },
},{timestamps: true});

const Profit = mongoose.model('Profit', profitSchema);
export default Profit;