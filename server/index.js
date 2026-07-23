import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectMongoDB } from "./db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect MongoDB on startup
connectMongoDB();

// API Root Endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ST Mart API Gateway",
    availableEndpoints: {
      health: "/api/health",
      products: "/api/products",
      orders: "/api/orders",
      authLogin: "/api/auth/login",
      authRegister: "/api/auth/register",
      authGoogle: "/api/auth/google"
    }
  });
});

// Healthcheck Endpoint
app.get("/api/health", async (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  let totalProducts = 0;
  if (isMongoConnected) {
    totalProducts = await Product.countDocuments();
  }
  res.json({
    status: "ok",
    database: isMongoConnected ? "MongoDB Active (Mongoose)" : "MongoDB Disconnected / Standing By",
    totalProductsInDB: totalProducts,
    timestamp: new Date().toISOString(),
  });
});

// --- PRODUCT ENDPOINTS ---

// GET /api/products (MongoDB Query with filtering)
app.get("/api/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { desc: searchRegex },
      ];
    }

    const isMongoConnected = mongoose.connection.readyState === 1;
    let products = [];

    if (isMongoConnected) {
      products = await Product.find(filter).sort({ id: -1 }).lean();
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error GET /api/products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findOne({ id }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products (Seller Portal endpoint - Create Mongoose Document)
app.post("/api/products", async (req, res) => {
  try {
    const { name, brand, category, price, originalPrice, desc, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide product name, price, and category.",
      });
    }

    const numPrice = Number(price);
    const numOriginalPrice = originalPrice ? Number(originalPrice) : numPrice;
    const discountCalc =
      numOriginalPrice > numPrice
        ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
        : 0;

    const count = await Product.countDocuments();
    const newProduct = new Product({
      id: count + 100,
      name,
      brand: brand || "Generic",
      category: category.toLowerCase(),
      price: numPrice,
      originalPrice: numOriginalPrice,
      discount: discountCalc,
      rating: 4.5,
      reviewsCount: 1,
      image:
        image ||
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
      desc: desc || "High quality product.",
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product listed successfully in MongoDB!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error POST /api/products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- AUTHENTICATION ENDPOINTS ---

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User with this email already exists." });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password,
      provider: "local",
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account registered successfully in MongoDB!",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        password: password || "1234",
        name: email.split("@")[0],
        provider: "otp",
      });
      await user.save();
    }

    res.json({
      success: true,
      message: "Logged in successfully!",
      token: `token_${Date.now()}`,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/google (Google OAuth in MongoDB)
app.post("/api/auth/google", async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Google account email is required." });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        googleId: googleId || `google_${Date.now()}`,
        picture: picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        provider: "google",
      });
      await user.save();
    }

    res.json({
      success: true,
      message: `Signed in with Google as ${email}!`,
      token: `google_token_${Date.now()}`,
      user: { id: user._id, email: user.email, name: user.name, picture: user.picture },
    });
  } catch (error) {
    console.error("Error POST /api/auth/google:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- ORDERS ENDPOINTS ---

// GET /api/orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders (Checkout Endpoint - Create Mongoose Order Document)
app.post("/api/orders", async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, userEmail } = req.body;

    if (!items || !items.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart cannot be empty." });
    }

    const orderId = `ORD-${Date.now()}`;
    const newOrder = new Order({
      id: orderId,
      userEmail: userEmail || "guest@ST Mart.com",
      items,
      totalAmount: totalAmount || 0,
      shippingAddress: shippingAddress || "Default Address",
      paymentMethod: paymentMethod || "UPI / Card",
      status: "CONFIRMED",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully in MongoDB!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error POST /api/orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ST Mart Express Backend running on port ${PORT}`);
  console.log(`🍃 Database Engine: MongoDB + Mongoose`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
  console.log(`👉 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
