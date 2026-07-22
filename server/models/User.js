import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  name: String,
  googleId: String,
  picture: String,
  provider: { type: String, default: "local" },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
