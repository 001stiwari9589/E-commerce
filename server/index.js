import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { connectMongoDB } from "./db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";

// Auto-load .env file if present
try {
  process.loadEnvFile();
} catch (e) {
  // .env file is optional or handled by environment
}

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio WhatsApp Integration (replace env vars or set in .env)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
const OWNER_WHATSAPP = process.env.OWNER_WHATSAPP || "whatsapp:+919589018011";

let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_ACCOUNT_SID.startsWith("AC") && TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio WhatsApp SDK initialized for +919589018011");
  } catch (err) {
    console.warn("⚠️ Twilio setup notice:", err.message);
  }
}

// In-memory OTP store (email/phone => { otp, expiresAt })
const activeOtpStore = new Map();

// Nodemailer SMTP Transporter
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || "stmart.verify@ethereal.email",
    pass: process.env.SMTP_PASS || "stmartPass123",
  },
});

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

// GET /api/products (MongoDB Query with filtering & local db.json fallback)
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

    // Fallback to reading db.json if MongoDB returns empty
    if (products.length === 0 && fs.existsSync(SEED_JSON_PATH)) {
      const rawData = fs.readFileSync(SEED_JSON_PATH, "utf-8");
      const parsed = JSON.parse(rawData);
      let allLocal = parsed.products || [];
      if (category && category !== "all") {
        allLocal = allLocal.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        allLocal = allLocal.filter(p => 
          (p.name || "").toLowerCase().includes(s) || 
          (p.brand || "").toLowerCase().includes(s) || 
          (p.category || "").toLowerCase().includes(s) ||
          (p.desc || "").toLowerCase().includes(s)
        );
      }
      products = allLocal;
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

// DELETE /api/products/:id (Owner Protected - Delete Product Card from DB & local file)
app.delete("/api/products/:id", verifyAdminSecret, async (req, res) => {
  try {
    const rawId = req.params.id;
    const numId = Number(rawId);

    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      await Product.findOneAndDelete({
        $or: [
          { id: numId },
          { _id: mongoose.Types.ObjectId.isValid(rawId) ? rawId : null },
        ],
      });
    }

    // Also remove from db.json if present
    if (fs.existsSync(SEED_JSON_PATH)) {
      try {
        const rawData = fs.readFileSync(SEED_JSON_PATH, "utf-8");
        const parsed = JSON.parse(rawData);
        if (parsed.products && Array.isArray(parsed.products)) {
          const initialLen = parsed.products.length;
          parsed.products = parsed.products.filter(
            (p) => p.id !== numId && String(p.id) !== rawId && String(p._id) !== rawId
          );
          if (parsed.products.length !== initialLen) {
            fs.writeFileSync(SEED_JSON_PATH, JSON.stringify(parsed, null, 2), "utf-8");
          }
        }
      } catch (e) {
        console.warn("Notice updating db.json during delete:", e.message);
      }
    }

    res.json({
      success: true,
      message: `Product card #${rawId} deleted successfully from database!`,
    });
  } catch (error) {
    console.error("Error DELETE /api/products/:id:", error);
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

const normalizeKey = (emailOrPhone) => {
  if (!emailOrPhone) return "";
  const clean = emailOrPhone.trim().toLowerCase();
  if (clean.includes("@")) return clean;
  const digits = clean.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// POST /api/auth/send-otp (Send real OTP to Email/SMS)
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: "Email or Phone is required" });
    }

    const key = normalizeKey(emailOrPhone);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    activeOtpStore.set(key, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    if (emailOrPhone.includes("@")) {
      try {
        await mailTransporter.sendMail({
          from: '"ST Mart Verification" <no-reply@stmart.com>',
          to: emailOrPhone.trim(),
          subject: `${otp} is your ST Mart Security Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
              <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e0e0e0;">
                <h2 style="color: #2563eb; margin-top: 0;">ST MART Security OTP</h2>
                <p>Hello,</p>
                <p>Your 6-digit security verification code for <strong>ST Mart</strong> is:</p>
                <div style="font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 4px; padding: 15px; background: #ecfdf5; border-radius: 8px; text-align: center; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="font-size: 12px; color: #6b7280;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.warn("Nodemailer dispatch notice:", mailErr.message);
      }
    }

    res.json({
      success: true,
      message: `OTP sent successfully to ${emailOrPhone}`,
      otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/verify-otp (Verify user entered OTP)
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    if (!emailOrPhone || !otp) {
      return res.status(400).json({ success: false, message: "Email/Phone and OTP are required" });
    }

    const key = normalizeKey(emailOrPhone);
    const storedData = activeOtpStore.get(key);

    if (storedData && storedData.otp === otp.trim() && Date.now() < storedData.expiresAt) {
      activeOtpStore.delete(key);
      return res.json({
        success: true,
        message: "OTP Verified successfully!",
        user: { email: key },
      });
    }

    res.status(400).json({
      success: false,
      message: `Invalid OTP code! Please check your Email Inbox / SMS for the correct 6-digit verification code.`,
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

// --- ADMIN PANEL SECURITY MIDDLEWARE & ENDPOINTS ---
const ADMIN_SECRET = process.env.ADMIN_SECRET || "stmart_owner_secret_1234";

const verifyAdminSecret = (req, res, next) => {
  const reqSecret = req.headers["x-admin-secret"];
  if (!reqSecret || reqSecret !== ADMIN_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Backend Admin Authorization Required.",
    });
  }
  next();
};

// GET /api/admin/users - Fetch all registered users (Owner Protected)
app.get("/api/admin/users", verifyAdminSecret, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Error GET /api/admin/users:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/stats - Overview metrics & sales analytics (Owner Protected)
app.get("/api/admin/stats", verifyAdminSecret, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find().lean();
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    // Calculate product sales aggregation
    const productSalesMap = {};
    orders.forEach((ord) => {
      if (Array.isArray(ord.items)) {
        ord.items.forEach((item) => {
          const id = item.id || item._id || item.name;
          if (!productSalesMap[id]) {
            productSalesMap[id] = {
              id: item.id,
              name: item.name,
              qtySold: 0,
              revenue: 0,
              image: item.image || "",
            };
          }
          const itemQty = Number(item.qty) || 1;
          const itemPrice = Number(item.price) || 0;
          productSalesMap[id].qtySold += itemQty;
          productSalesMap[id].revenue += itemPrice * itemQty;
        });
      }
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qtySold - a.qtySold)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error GET /api/admin/stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order status (Owner Protected)
app.patch("/api/orders/:id/status", verifyAdminSecret, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({
      success: true,
      message: `Order status updated to "${status}" successfully!`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error PATCH /api/orders/:id/status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// POST /api/notify-whatsapp (Silent background alert recorder + Twilio API dispatch to 9589018011)
app.post("/api/notify-whatsapp", async (req, res) => {
  try {
    const { type, message, details, targetNumber } = req.body;
    const rawNum = (targetNumber || "9589018011").replace(/\D/g, "");
    const destPhone = `whatsapp:+${rawNum.startsWith("91") ? rawNum : "91" + rawNum}`;

    console.log("\n--------------------------------------------------");
    console.log(`📲 [WHATSAPP ALERT FOR OWNER 9589018011] Event: ${type}`);
    console.log(`⏰ Time: ${new Date().toLocaleString("en-IN")}`);
    console.log(`📱 Destination: ${destPhone}`);
    console.log(`📄 Message:\n${message}`);
    console.log("--------------------------------------------------\n");

    let twilioMsgSid = null;
    if (twilioClient) {
      try {
        const twRes = await twilioClient.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to: destPhone,
          body: message,
        });
        twilioMsgSid = twRes.sid;
        console.log(`🚀 [TWILIO LIVE WHATSAPP SENT!] SID: ${twRes.sid}`);
      } catch (twErr) {
        console.error("❌ Twilio API Dispatch Error:", twErr.message);
      }
    }

    res.json({
      success: true,
      message: twilioMsgSid
        ? `WhatsApp alert sent via Twilio to ${destPhone} (SID: ${twilioMsgSid})`
        : "Notification recorded on ST Mart Server for +919589018011!",
      sid: twilioMsgSid,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error POST /api/notify-whatsapp:", error);
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
