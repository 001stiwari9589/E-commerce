import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    shopId: {
      type: String,
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "electronics",
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
