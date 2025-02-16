import mongoose from "mongoose";

const costSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     amount: {
          type: Number,
          required: true,
     },
     date: {
          type: Date,
          required: true,
     },
     status: {
          type: String,
          enum: ["deleted", "active"],
          default: "active",
     },
});

const Cost = mongoose.model("Cost", costSchema);
export default Cost;