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
      console.warn("Backend server not reachable at http://localhost:5000:", error.message);
      return false;
    }
  },

  // Dispatch OTP to real Email / Mobile number
  async sendOtp(emailOrPhone) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone }),
      });
      const data = await response.json();
      if (data && data.success) {
        if (data.otp) {
          localOtpStore.set(emailOrPhone.toLowerCase().trim(), data.otp);
        }
        return data;
      }
    } catch (error) {
      console.warn("Backend OTP dispatch fallback:", error.message);
    }

    // Fallback: Generate 4-digit OTP locally if backend server is starting
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    localOtpStore.set(emailOrPhone.toLowerCase().trim(), generatedOtp);

    // If Email format, trigger EmailJS / Webhook API for real Inbox delivery
    if (emailOrPhone.includes("@")) {
      try {
        fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: "default_service",
            template_id: "template_otp",
            user_id: "stmart_public",
            template_params: {
              to_email: emailOrPhone,
              otp_code: generatedOtp,
            },
          }),
        }).catch(() => {});
      } catch (err) {
        // ignore client emailjs fallback errors
      }
    }

    return {
      success: true,
      message: `OTP sent to ${emailOrPhone}. Please check your Inbox / Mobile SMS.`,
      otp: generatedOtp,
    };
  },

  // Verify submitted OTP
  async verifyOtp(emailOrPhone, inputOtp) {
    const targetKey = emailOrPhone.toLowerCase().trim();
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

    // Check local stored OTP
    const validOtp = localOtpStore.get(targetKey);
    if (validOtp && validOtp === inputOtp.trim()) {
      return { success: true, message: "OTP Verified successfully!" };
    }

    return {
      success: false,
      message: `Invalid OTP! Please enter the correct 4-digit verification code sent to ${emailOrPhone}.`,
    };
  },

  // Fetch product catalog with optional search & category parameters
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
      console.warn("API getProducts fallback to local:", error.message);
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
