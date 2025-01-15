import mongoose from "mongoose";

// Custom validation to ensure purchasePrice is less than both singlePrice and wholeSalePrice
const priceValidation = function () {
  return this.purchasePrice < this.singlePrice && this.purchasePrice < this.wholeSalePrice;
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Product name must be at least 3 characters long"],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
      validate: {
        validator: (value) => mongoose.Types.ObjectId.isValid(value),
        message: "Invalid Category ID format",
      },
    },
    code: {
      type: String,
      required: [true, "Product code is required"],
      minlength: [3, "Product code must be at least 3 characters long"],
    },
    details: {
      type: String,
      default: "",
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: [0, "Purchase price must be a positive number"],
      validate: {
        validator: priceValidation,
        message: "Purchase price must be less than both single price and wholesale price.",
      },
    },
    wholeSalePrice: {
      type: Number,
      required: [true, "Wholesale price is required"],
      min: [0, "Wholesale price must be a positive number"],
    },
    singlePrice: {
      type: Number,
      required: [true, "Single price is required"],
      min: [0, "Single price must be a positive number"],
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Supplier ID is required"],
      validate: {
        validator: (value) => mongoose.Types.ObjectId.isValid(value),
        message: "Invalid Supplier ID format",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be a positive number"],
    },
    image: {
      type: String,
      default: "",
      required:[true,"image is required"]
    },
  },
  { timestamps: true }
);

// Create the model
const Product = mongoose.model("Product", productSchema);
export default Product;
