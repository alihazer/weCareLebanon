import mongoose from "mongoose";
import autoIncrement from "mongoose-sequence"; // Import the plugin

const { Schema } = mongoose;

const AutoIncrement = autoIncrement(mongoose);

const invoiceSchema = new Schema(
  {
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        isWholeSale: { type: Boolean, required: true },
        note: { type: String, default: "" },
      },
    ],
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

invoiceSchema.plugin(AutoIncrement, { inc_field: "invoiceNumber", start_seq: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
