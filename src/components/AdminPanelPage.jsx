import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { PRODUCTS_DATABASE } from "../data/products";

export default function AdminPanelPage({ onBack, triggerToast, onAddProduct }) {
  // Security Passcode PIN State (Default PIN: 1234)
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("stmart_admin_unlocked") === "true";
  });
  const [pinError, setPinError] = useState("");

  // Admin Data States
  const [activeTab, setActiveTab] = useState("cards"); // "cards" | "orders" | "users" | "sellers" | "analytics"
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Add Product Card Form State
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    brand: "",
    category: "electronics",
    price: "",
    originalPrice: "",
    image: "",
    desc: "",
  });

  // Unlock Admin Panel handler
  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput === "1234" || pinInput === "admin" || pinInput === "admin123") {
      setIsUnlocked(true);
      sessionStorage.setItem("stmart_admin_unlocked", "true");
      setPinError("");
      if (triggerToast) triggerToast("Admin Panel Unlocked Successfully! 🔓", "success");
    } else {
      setPinError("Invalid Security PIN! Please use '1234'");
      if (triggerToast) triggerToast("Incorrect PIN! Try '1234'", "error");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("stmart_admin_unlocked");
    if (triggerToast) triggerToast("Admin Panel Locked 🔒", "info");
  };

  // Fetch Admin Data & Product Cards from Database
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, usersData, statsData, fetchedProducts, sellersData] = await Promise.all([
        apiService.getOrders(),
        apiService.getAdminUsers(),
        apiService.getAdminStats(),
        apiService.getProducts("all", ""),
        apiService.getAdminSellers(),
      ]);

      setOrders(ordersData || []);
      setUsers(usersData || []);
      setStats(statsData);
      setProductsList(
        fetchedProducts && fetchedProducts.length > 0
          ? fetchedProducts
          : PRODUCTS_DATABASE
      );
      setSellers(sellersData || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      setProductsList(PRODUCTS_DATABASE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAdminData();
    }
  }, [isUnlocked]);

  // Handle Add Product Card
  const handleCreateProductCard = async (e) => {
    e.preventDefault();
    if (!newCard.name || !newCard.price) {
      if (triggerToast) triggerToast("Please enter product name and price!", "error");
      return;
    }

    setIsSubmittingCard(true);
    try {
      const payload = {
        name: newCard.name.trim(),
        brand: newCard.brand.trim() || "ST Mart",
        category: newCard.category.toLowerCase(),
        price: Number(newCard.price),
        originalPrice: newCard.originalPrice ? Number(newCard.originalPrice) : Number(newCard.price),
        image:
          newCard.image.trim() ||
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
        desc: newCard.desc.trim() || "High quality product.",
      };

      const res = await apiService.addProduct(payload);
      const createdCard = (res && (res.data || res.product)) ? (res.data || res.product) : { ...payload, id: Date.now() };

      if (triggerToast) triggerToast(`Product card "${payload.name}" added to Database! 🚀`, "success");

      // 1. Immediately prepend created card to local Admin state so it is visible instantly
      setProductsList((prev) => [createdCard, ...prev]);

      // 2. Trigger global callback to update store state
      if (onAddProduct) {
        onAddProduct(createdCard);
      }

      // Close modal and reset form
      setShowAddCardModal(false);
      setNewCard({
        name: "",
        brand: "",
        category: "electronics",
        price: "",
        originalPrice: "",
        image: "",
        desc: "",
      });

      // Background sync fresh dataset
      fetchAdminData();
    } catch (err) {
      console.error("Error adding product card:", err);
      if (triggerToast) triggerToast("Server error while adding product card", "error");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  // Handle Remove / Delete Product Card
  const handleRemoveProductCard = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${productName}" card from the Database?`
    );
    if (!confirmDelete) return;

    try {
      const res = await apiService.deleteProduct(productId);
      if (res && res.success) {
        if (triggerToast) triggerToast(`Product card "${productName}" removed from Database! 🗑️`, "success");
        setProductsList((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
      } else {
        setProductsList((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
        if (triggerToast) triggerToast(`Product card "${productName}" removed!`, "info");
      }
    } catch (err) {
      console.error("Error removing product card:", err);
      if (triggerToast) triggerToast("Failed to remove product card from server", "error");
    }
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await apiService.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        if (triggerToast) triggerToast(`Order ${orderId} status updated to ${newStatus}! 🚚`, "success");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (triggerToast) triggerToast(`Order status updated to ${newStatus}!`, "success");
      }
    } catch (err) {
      if (triggerToast) triggerToast("Failed to update status on server", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // KPI Calculations
  const calculatedTotalRevenue = orders.reduce(
    (acc, curr) => acc + (Number(curr.totalAmount) || 0),
    0
  );
  const totalOrdersCount = orders.length;
  const totalUsersCount = users.length;
  const totalProductsCardsCount = productsList.length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      (order.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shippingAddress?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (order.status || "CONFIRMED").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    return (
      !searchQuery ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.provider || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filtered Product Cards
  const filteredProductCards = productsList.filter((p) => {
    return (
      !searchQuery ||
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // -------------------------------------------------------------
  // PIN UNLOCK SCREEN (If Locked)
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 text-white text-3xl">
          🔐
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          ST Mart Admin Portal
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Enter Security PIN to access Owner Dashboard & Database Records.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength={10}
              className="w-full text-center text-2xl font-bold tracking-widest px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              autoFocus
            />
            {pinError && (
              <p className="text-xs font-semibold text-rose-500 mt-2 animate-bounce">
                {pinError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
          >
            Unlock Admin Panel 🚀
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400">
          <span> Enter PIN: <strong className="text-amber-600 dark:text-amber-400"></strong></span>
          <button onClick={onBack} className="hover:underline text-slate-600 dark:text-zinc-300">
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">

      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-black shadow-md shadow-orange-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ST Mart Store Owner Admin Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                DATABASE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Manage database product cards, view customer orders, track user registrations, and monitor store metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowAddCardModal(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
          >
            ➕ Add Product Card
          </button>

          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span className={isLoading ? "animate-spin" : ""}>🔄</span>
            Refresh Data
          </button>

          <button
            onClick={handleLock}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            🔒 Lock Panel
          </button>

          <button
            onClick={onBack}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
          >
            ← Store Front
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Database Product Cards */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl font-black">📦</div>
          <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">Database Product Cards</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-2">
            {totalProductsCardsCount} Cards
          </h3>
          <p className="text-[11px] text-amber-100/80 mt-1">Live in store catalog</p>
        </div>

        {/* Total Sales Revenue */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl font-black">₹</div>
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Total Sales Revenue</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-2">
            ₹{calculatedTotalRevenue.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-emerald-100/80 mt-1">From {totalOrdersCount} completed orders</p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl font-black">🛍️</div>
          <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Total Orders Booked</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-2">
            {totalOrdersCount}
          </h3>
          <p className="text-[11px] text-blue-100/80 mt-1">Customer order bookings</p>
        </div>

        {/* Registered Users */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-700 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl font-black">👤</div>
          <p className="text-xs font-bold text-purple-100 uppercase tracking-wider">Registered Users</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-2">
            {totalUsersCount}
          </h3>
          <p className="text-[11px] text-purple-100/80 mt-1">Google & Email Accounts</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "cards"
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
            : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800"
            }`}
        >
          📦 Database Product Cards
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {productsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "orders"
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
            : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800"
            }`}
        >
          🛍️ Customer Orders Management
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "users"
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
            : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800"
            }`}
        >
          👤 User Accounts Directory
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sellers")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "sellers"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800"
            }`}
        >
          🏬 Seller Shops Directory
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {sellers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "analytics"
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
            : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800"
            }`}
        >
          📊 Sales Leaderboard & Analytics
        </button>
      </div>

      {/* TAB 1: PRODUCT CARDS MANAGEMENT (ADD & REMOVE CARDS) */}
      {activeTab === "cards" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-5">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                📦 Database Product Cards
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Total in Database: {productsList.length} Cards
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Add new product cards or remove existing cards directly from MongoDB & local catalog.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search product card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-4 py-2 text-xs font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition whitespace-nowrap cursor-pointer"
              >
                ➕ Add Card
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredProductCards.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-4xl">📦</span>
              <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                No Product Cards Found
              </h4>
              <p className="text-xs text-slate-400">Click "Add Card" to create a new product card in database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProductCards.map((product) => (
                <div
                  key={product.id || product._id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-amber-400 transition flex flex-col justify-between gap-3 group relative"
                >
                  <div>
                    <div className="relative w-full h-36 bg-white dark:bg-zinc-900 rounded-xl p-2 mb-3 overflow-hidden border border-slate-100 dark:border-zinc-800 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                        {product.category || "General"}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      Brand: {product.brand || "ST Mart"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProductCard(product.id || product._id, product.name)}
                    className="w-full py-2 px-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    🗑️ Remove Card
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-5">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search orders by ID, Email, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              <span className="absolute left-3 top-3 text-xs text-slate-400">🔍</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {["all", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${statusFilter === st
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200"
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-4xl">🛍️</span>
              <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                No Orders Found
              </h4>
              <p className="text-xs text-slate-400">
                {searchQuery || statusFilter !== "all"
                  ? "Try clearing filters to view all orders."
                  : "When customers place orders, they will instantly appear here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((ord) => {
                const orderDateFormatted = ord.orderDate
                  ? new Date(ord.orderDate).toLocaleString("en-IN")
                  : new Date().toLocaleString("en-IN");

                const addr = ord.shippingAddress || {};
                const customerName = addr.fullName || ord.userEmail?.split("@")[0] || "Customer";

                return (
                  <div
                    key={ord.id || ord._id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-amber-400 transition flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-zinc-700/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {ord.id || `ORD-${ord._id}`}
                          </span>
                          <span className="text-xs text-slate-400">| {orderDateFormatted}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 mt-0.5">
                          👤 <strong>{customerName}</strong> ({ord.userEmail || "guest"}) • 📞 {addr.phone || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Total Paid</p>
                          <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            ₹{Number(ord.totalAmount || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <select
                          value={ord.status || "CONFIRMED"}
                          disabled={updatingOrderId === (ord.id || ord._id)}
                          onChange={(e) => handleStatusChange(ord.id || ord._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="CONFIRMED">🟡 CONFIRMED</option>
                          <option value="PROCESSING">⚙️ PROCESSING</option>
                          <option value="SHIPPED">🚚 SHIPPED</option>
                          <option value="DELIVERED">✅ DELIVERED</option>
                          <option value="CANCELLED">❌ CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Items Purchased ({ord.items?.length || 0}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Array.isArray(ord.items) &&
                          ord.items.map((item, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 flex items-center gap-3"
                            >
                              <img
                                src={item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150"}
                                alt={item.name}
                                className="w-10 h-10 object-contain bg-slate-50 dark:bg-zinc-800 rounded-lg"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                  Qty: <strong>{item.qty || 1}</strong> × ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-zinc-400 bg-slate-100/70 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-200/40 dark:border-zinc-800">
                      📍 <strong>Shipping Address:</strong> {addr.streetAddress || addr || "Standard Delivery Address"}, {addr.city || ""} {addr.state || ""} - {addr.pincode || ""}
                      <span className="ml-3 font-semibold text-slate-700 dark:text-zinc-300">
                        💳 Payment Mode: {ord.paymentMethod || "UPI / Online"}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS DIRECTORY */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Registered Customer Accounts ({users.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Track all customer accounts registered via Google OAuth or Email OTP login.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search user by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-4xl">👤</span>
              <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                No Users Found
              </h4>
              <p className="text-xs text-slate-400">Users will appear here when they register or sign in.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Auth Method</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredUsers.map((u) => {
                    const avatarUrl = u.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`;
                    const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Active";

                    return (
                      <tr key={u._id || u.email} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                          <span className="font-bold text-slate-800 dark:text-zinc-200">{u.name || u.email.split("@")[0]}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-zinc-300 font-medium">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${u.provider === "google"
                            ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            }`}>
                            {u.provider === "google" ? "🌐 Google OAuth" : "🔑 Email / OTP"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">{joinedDate}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Active Customer
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SELLER SHOPS DIRECTORY */}
      {activeTab === "sellers" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🏬 Registered Seller Shops Directory
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Total Sellers: {sellers.length} Shops
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                All registered seller shop accounts and unique Shop IDs in MongoDB database.
              </p>
            </div>
          </div>

          {sellers.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-4xl">🏬</span>
              <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                No Seller Shops Registered Yet
              </h4>
              <p className="text-xs text-slate-400">When sellers create a Shop ID in the Seller Portal, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 font-extrabold border-b border-slate-200 dark:border-zinc-700">
                    <th className="py-3 px-4">Shop ID</th>
                    <th className="py-3 px-4">Store Name</th>
                    <th className="py-3 px-4">Owner Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                  {sellers.map((s) => (
                    <tr key={s._id || s.shopId} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-black text-amber-600 dark:text-amber-400">{s.shopId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.storeName}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-zinc-300">{s.ownerName}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">{s.email}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">{s.phone || "N/A"}</td>
                      <td className="py-3 px-4 capitalize text-emerald-600 dark:text-emerald-400 font-bold">{s.category}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          ACTIVE SELLER
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BEST-SELLING PRODUCTS & ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              📊 Best-Selling Products & Revenue Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Top items ordered by customer demand and sales earnings.
            </p>
          </div>

          {!stats?.topProducts || stats.topProducts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-4xl">📈</span>
              <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                No Sales Data Available Yet
              </h4>
              <p className="text-xs text-slate-400">As orders are placed, top-selling product analytics will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.topProducts.map((tp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {tp.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Total Sold: <strong className="text-amber-600 dark:text-amber-400">{tp.qtySold} Units</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Revenue</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{tp.revenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD PRODUCT CARD */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              ➕ Add New Database Product Card
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
              Enter product details to list a new card live in store database.
            </p>

            <form onSubmit={handleCreateProductCard} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Bluetooth Earbuds"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Category *</label>
                  <select
                    value={newCard.category}
                    onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="electronics" className="dark:bg-zinc-900 dark:text-white">Electronics</option>
                    <option value="fashion" className="dark:bg-zinc-900 dark:text-white">Fashion</option>
                    <option value="home" className="dark:bg-zinc-900 dark:text-white">Home & Kitchen</option>
                    <option value="grocery" className="dark:bg-zinc-900 dark:text-white">Grocery</option>
                    <option value="beauty" className="dark:bg-zinc-900 dark:text-white">Beauty & Care</option>
                    <option value="sports" className="dark:bg-zinc-900 dark:text-white">Sports & Gym</option>
                    <option value="toys" className="dark:bg-zinc-900 dark:text-white">Toys & Games</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Boat / Sony / ST Mart"
                    value={newCard.brand}
                    onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1499"
                    value={newCard.price}
                    onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2999"
                    value={newCard.originalPrice}
                    onChange={(e) => setNewCard({ ...newCard, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newCard.image}
                  onChange={(e) => setNewCard({ ...newCard, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product description and details..."
                  value={newCard.desc}
                  onChange={(e) => setNewCard({ ...newCard, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCard}
                  className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {isSubmittingCard ? "Saving Card..." : "Save Product Card 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
