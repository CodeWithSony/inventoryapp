import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    supplierName: { type: String, required: true },
    category: {
      type: String,
      enum: ["Spices", "Grains", "Electrical", "Toys", "Snacks"],
      required: true,
    },
    quantity: {
      amount: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["Kg", "Liters", "Packets", "Pieces"],
        required: true,
      },
    },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stockAvailable: { type: Number, required: true },
    expiryDate: { type: Date, default: null },
    dateOfPurchase: { type: Date, required: true },
    dateOfSale: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
