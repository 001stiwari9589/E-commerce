import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  shippingAddress: String,
  paymentMethod: String,
  status: { type: String, default: "CONFIRMED" },
  orderDate: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
