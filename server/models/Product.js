import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  brand: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: Number,
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 10 },
  image: String,
  desc: String,
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
