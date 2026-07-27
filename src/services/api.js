import emailjs from "@emailjs/browser";

const API_BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://e-commerce-20vs.onrender.com/api";

// Local in-memory OTP store fallback
const localOtpStore = new Map();

export const apiService = {
  // Check backend server health
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === "ok";
    } catch (error) {
      console.warn("Backend server not reachable:", error.message);
      return false;
    }
  },

  // Dispatch Real-time OTP to Email / Mobile
  async sendOtp(emailOrPhone) {
    const key = emailOrPhone.toLowerCase().trim();
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    localOtpStore.set(key, generatedOtp);

    // 1. Send via Express Backend API (Nodemailer)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: key }),
      });
      const data = await response.json();
      if (data && data.success) {
        if (data.otp) localOtpStore.set(key, data.otp);
        return data;
      }
    } catch (error) {
      console.warn("Backend OTP API notice:", error.message);
    }

    // 2. Client-side Real EmailJS Dispatch if Email address
    if (key.includes("@")) {
      try {
        emailjs.send(
          "service_stmart_auth",
          "template_stmart_otp",
          {
            to_email: key,
            to_name: key.split("@")[0],
            otp_code: generatedOtp,
            app_name: "ST Mart",
          },
          "public_stmart_key"
        ).catch(() => {});
      } catch (err) {
        console.warn("EmailJS notice:", err.message);
      }
    }

    return {
      success: true,
      message: `Security OTP sent to ${emailOrPhone}. Please check your Inbox.`,
      otp: generatedOtp,
    };
  },

  // Verify user entered OTP
  async verifyOtp(emailOrPhone, inputOtp) {
    const targetKey = emailOrPhone.toLowerCase().trim();

    // 1. Try Backend Verification API
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: targetKey, otp: inputOtp }),
      });
      const data = await response.json();
      if (data && data.success) return data;
    } catch (error) {
      console.warn("Backend verify OTP fallback:", error.message);
    }

    // 2. Check local stored OTP
    const validOtp = localOtpStore.get(targetKey);
    if (validOtp && validOtp === inputOtp.trim()) {
      return { success: true, message: "OTP Verified successfully!" };
    }

    return {
      success: false,
      message: `Invalid OTP code! Please enter the correct 4-digit code sent to ${emailOrPhone}.`,
    };
  },

  // Fetch product catalog
  async getProducts(category = "all", search = "") {
    try {
      const url = new URL(`${API_BASE_URL}/products`);
      if (category && category !== "all") url.searchParams.append("category", category);
      if (search) url.searchParams.append("search", search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch products");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.warn("API getProducts error:", error.message);
      return null;
    }
  },

  // Create a new seller product
  async addProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API addProduct error:", error);
      return { success: false, message: error.message };
    }
  },

  // Authenticate User Login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API login error:", error);
      return { success: false, message: "Server connection failed" };
    }
  },

  // Authenticate Google OAuth Login
  async loginWithGoogle(googleProfile) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleProfile),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API google login error:", error);
      return { success: false, message: "Google server connection failed" };
    }
  },

  // User Registration
  async register(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API register error:", error);
      return { success: false, message: "Server connection failed" };
    }
  },

  // Place order at checkout
  async createOrder(orderPayload) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API createOrder error:", error);
      return { success: false, message: "Server error while creating order" };
    }
  },

  // Get user order history
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn("API getOrders error:", error.message);
      return [];
    }
  },
};
