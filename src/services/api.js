// Frontend API client service connecting React app to Express Backend API

const API_BASE_URL = "http://localhost:5000/api";

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
      return null; // Return null so caller can fallback to local state if needed
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
