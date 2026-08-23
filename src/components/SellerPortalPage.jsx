import { useState, useEffect } from "react";
import { apiService } from "../services/api";

function SellerPortalPage({ onBack, triggerToast, onAddProduct }) {
  // Mode state: "register" | "login" | "dashboard"
  const [activeTab, setActiveTab] = useState("register");

  // Logged-in Seller State
  const [activeSeller, setActiveSeller] = useState(() => {
    try {
      const saved = localStorage.getItem("stmart_active_seller");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Seller Products State for Dashboard
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Registration Form State
  const [registerForm, setRegisterForm] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "electronics",
    password: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredBadge, setRegisteredBadge] = useState(null);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    shopIdOrEmail: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Add Product Form State in Dashboard
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: "electronics",
    image: "",
    desc: "",
  });
  const [productErrors, setProductErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (activeSeller) {
      setActiveTab("dashboard");
      fetchSellerProducts(activeSeller.shopId);
    }
  }, [activeSeller?.shopId]);

  // Validate Seller Registration Form
  const validateRegisterForm = () => {
    const errs = {};
    const store = (registerForm.storeName || "").trim();
    const owner = (registerForm.ownerName || "").trim();
    const email = (registerForm.email || "").trim();
    const phone = (registerForm.phone || "").trim().replace(/\D/g, "");
    const pass = registerForm.password || "";

    if (!store) {
      errs.storeName = "Store Name is required.";
    } else if (store.length < 3) {
      errs.storeName = "Store Name must be at least 3 characters long.";
    }

    if (!owner) {
      errs.ownerName = "Owner Name is required.";
    } else if (owner.length < 3 || !/^[a-zA-Z\s.]{3,}$/.test(owner)) {
      errs.ownerName = "Owner Name must contain only letters & spaces (min 3 chars).";
    }

    if (!email) {
      errs.email = "Business Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address (e.g. seller@stmart.com).";
    }

    if (phone && (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone))) {
      errs.phone = "Mobile phone must be a 10-digit number starting with 6, 7, 8, or 9.";
    }

    if (!pass) {
      errs.password = "Password is required.";
    } else if (pass.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }

    setRegisterErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Seller Login Form
  const validateLoginForm = () => {
    const errs = {};
    const identifier = (loginForm.shopIdOrEmail || "").trim();
    const pass = loginForm.password || "";

    if (!identifier) {
      errs.shopIdOrEmail = "Shop ID or Email is required.";
    }

    if (!pass) {
      errs.password = "Password is required.";
    }

    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Add Product Form
  const validateProductForm = () => {
    const errs = {};
    const name = (newProductForm.name || "").trim();
    const brand = (newProductForm.brand || "").trim();
    const priceNum = Number(newProductForm.price);
    const origPriceNum = newProductForm.originalPrice ? Number(newProductForm.originalPrice) : null;
    const image = (newProductForm.image || "").trim();
    const desc = (newProductForm.desc || "").trim();

    if (!name) {
      errs.name = "Product name is required.";
    } else if (name.length < 3) {
      errs.name = "Product name must be at least 3 characters.";
    }

    if (brand && brand.length < 2) {
      errs.brand = "Brand name must be at least 2 characters.";
    }

    if (!newProductForm.price || isNaN(priceNum) || priceNum <= 0) {
      errs.price = "Enter a valid selling price greater than ₹0.";
    }

    if (origPriceNum !== null && (isNaN(origPriceNum) || origPriceNum < priceNum)) {
      errs.originalPrice = "Original Price (MRP) cannot be less than Selling Price.";
    }

    if (image && !/^https?:\/\/.+/i.test(image)) {
      errs.image = "Please enter a valid HTTP/HTTPS image URL.";
    }

    if (desc && desc.length < 10) {
      errs.desc = "Description must be at least 10 characters.";
    }

    setProductErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Fetch Seller Products
  const fetchSellerProducts = async (shopId) => {
    if (!shopId) return;
    setIsLoadingProducts(true);
    try {
      const prods = await apiService.getSellerProducts(shopId);
      setSellerProducts(prods || []);
    } catch (err) {
      console.error("Error fetching seller products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle Shop Registration
  const handleRegisterShop = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) {
      if (triggerToast) triggerToast("Please fix the highlighted errors in the form!", "warning");
      return;
    }

    setIsRegistering(true);
    try {
      const res = await apiService.registerSeller(registerForm);
      if (res && res.success && res.seller) {
        setRegisteredBadge(res.seller);
        setActiveSeller(res.seller);
        localStorage.setItem("stmart_active_seller", JSON.stringify(res.seller));
        setRegisterErrors({});

        if (triggerToast) {
          triggerToast(`🎉 Shop ID "${res.seller.shopId}" generated successfully!`, "success");
        }
      } else {
        if (triggerToast) triggerToast(res.message || "Registration failed. Try again.", "error");
      }
    } catch (err) {
      console.error("Error registering seller:", err);
      if (triggerToast) triggerToast("Server error during shop registration.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Seller Login
  const handleSellerLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) {
      if (triggerToast) triggerToast("Please enter valid credentials!", "warning");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await apiService.loginSeller(loginForm.shopIdOrEmail, loginForm.password);
      if (res && res.success && res.seller) {
        setActiveSeller(res.seller);
        localStorage.setItem("stmart_active_seller", JSON.stringify(res.seller));
        setActiveTab("dashboard");
        setLoginErrors({});
        fetchSellerProducts(res.seller.shopId);

        if (triggerToast) {
          triggerToast(`Welcome back, ${res.seller.storeName}! Logged in as Shop ID ${res.seller.shopId}`, "success");
        }
      } else {
        if (triggerToast) triggerToast(res.message || "Invalid Shop ID / Email or Password!", "error");
      }
    } catch (err) {
      console.error("Error logging in seller:", err);
      if (triggerToast) triggerToast("Server error during seller login.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Seller Logout
  const handleSellerLogout = () => {
    setActiveSeller(null);
    setRegisteredBadge(null);
    localStorage.removeItem("stmart_active_seller");
    setActiveTab("register");
    if (triggerToast) triggerToast("Logged out from Seller Dashboard.", "info");
  };

  // Handle Add Product from Seller Dashboard
  const handleAddSellerProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      if (triggerToast) triggerToast("Please enter product name and price!", "warning");
      return;
    }

    setIsSubmittingProduct(true);
    const numPrice = Number(newProductForm.price);
    const numMRP = newProductForm.originalPrice ? Number(newProductForm.originalPrice) : numPrice;

    const payload = {
      name: newProductForm.name.trim(),
      brand: newProductForm.brand.trim() || activeSeller?.storeName || "Seller Store",
      price: numPrice,
      originalPrice: numMRP,
      category: newProductForm.category.toLowerCase(),
      image:
        newProductForm.image.trim() ||
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
      desc: newProductForm.desc.trim() || `Listed by verified seller ${activeSeller?.storeName || "ST Mart Seller"}.`,
      shopId: activeSeller?.shopId || "OFFICIAL_STORE",
    };

    try {
      const res = await apiService.addProduct(payload);
      const newCard = res && (res.data || res.product) ? (res.data || res.product) : { ...payload, id: Date.now() };

      if (onAddProduct) {
        await onAddProduct(newCard);
      }

      setSellerProducts((prev) => [newCard, ...prev]);
      setShowAddProductModal(false);
      setNewProductForm({
        name: "",
        brand: "",
        price: "",
        originalPrice: "",
        category: "electronics",
        image: "",
        desc: "",
      });

      if (triggerToast) {
        triggerToast(`Product "${payload.name}" listed live under Shop ID ${activeSeller?.shopId}! 🚀`, "success");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      if (triggerToast) triggerToast("Failed to list product.", "error");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle Delete Seller Product
  const handleDeleteSellerProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${productName}" from your shop?`);
    if (!confirmDelete) return;

    try {
      await apiService.deleteProduct(productId);
      setSellerProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
      if (triggerToast) triggerToast(`Product "${productName}" removed from your shop! 🗑️`, "info");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fade-in text-slate-800 dark:text-zinc-150 my-4">

      {/* Back to Store Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Store Catalog
        </button>

        {activeSeller && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
              🏬 {activeSeller.storeName} ({activeSeller.shopId})
            </span>
            <button
              onClick={handleSellerLogout}
              className="text-xs font-bold px-3 py-1 bg-slate-200 dark:bg-zinc-800 hover:bg-red-500 hover:text-white rounded-xl transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Banner Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
            ✦ ST Mart Official Seller Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-3 leading-tight">
            Create Your Seller Shop ID &amp; Sell Nationwide
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 dark:text-zinc-300 mt-2 leading-relaxed">
            Register your store, get a unique Shop ID (e.g. SHOP-849201), and manage your products live on ST Mart!
          </p>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        {!activeSeller ? (
          <>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "register"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
              }`}
            >
              📝 Register New Shop ID
            </button>

            <button
              onClick={() => setActiveTab("login")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "login"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
              }`}
            >
              🔑 Seller Shop Login
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            🏬 Seller Shop Dashboard ({activeSeller.shopId})
          </button>
        )}
      </div>

      {/* TAB 1: REGISTER NEW SHOP ID */}
      {activeTab === "register" && !activeSeller && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {registeredBadge ? (
            /* Digital Shop ID Badge View */
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-500/30">
                🏬
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Shop Registered Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Your official ST Mart Seller Shop ID is generated and ready to use.
                </p>
              </div>

              {/* Digital Badge Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-emerald-950 text-white border border-emerald-500/40 shadow-2xl max-w-sm w-full relative overflow-hidden my-2">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-black">🆔</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Official Seller Badge</p>
                <h2 className="text-3xl font-black text-yellow-400 tracking-wider my-2">
                  {registeredBadge.shopId}
                </h2>
                <div className="text-xs text-slate-300 space-y-1 text-left pt-2 border-t border-white/10">
                  <p>🏪 <strong>Store:</strong> {registeredBadge.storeName}</p>
                  <p>👤 <strong>Owner:</strong> {registeredBadge.ownerName}</p>
                  <p>📧 <strong>Email:</strong> {registeredBadge.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  fetchSellerProducts(registeredBadge.shopId);
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg cursor-pointer transition"
              >
                Enter Seller Dashboard 🚀
              </button>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterShop} className="flex flex-col gap-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Create New Seller Shop Account 🏬
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Enter your business details below to generate a unique Shop ID.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ST Mart Electronics &amp; Mobiles"
                    value={registerForm.storeName}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, storeName: e.target.value });
                      if (registerErrors.storeName) setRegisterErrors({ ...registerErrors, storeName: "" });
                    }}
                    className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                      registerErrors.storeName ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } rounded-xl text-xs font-semibold outline-none transition-all`}
                  />
                  {registerErrors.storeName && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {registerErrors.storeName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ST Mart Owner"
                    value={registerForm.ownerName}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, ownerName: e.target.value });
                      if (registerErrors.ownerName) setRegisterErrors({ ...registerErrors, ownerName: "" });
                    }}
                    className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                      registerErrors.ownerName ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } rounded-xl text-xs font-semibold outline-none transition-all`}
                  />
                  {registerErrors.ownerName && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {registerErrors.ownerName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Business Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. seller@stmart.com"
                    value={registerForm.email}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, email: e.target.value });
                      if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: "" });
                    }}
                    className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                      registerErrors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } rounded-xl text-xs font-semibold outline-none transition-all`}
                  />
                  {registerErrors.email && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {registerErrors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Mobile Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9589018011"
                    value={registerForm.phone}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, phone: e.target.value });
                      if (registerErrors.phone) setRegisterErrors({ ...registerErrors, phone: "" });
                    }}
                    className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                      registerErrors.phone ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } rounded-xl text-xs font-semibold outline-none transition-all`}
                  />
                  {registerErrors.phone && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {registerErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Primary Business Category</label>
                  <select
                    value={registerForm.category}
                    onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="electronics">Electronics &amp; Gadgets</option>
                    <option value="fashion">Fashion &amp; Apparel</option>
                    <option value="mobiles">Mobiles &amp; Accessories</option>
                    <option value="home">Home &amp; Kitchen</option>
                    <option value="grocery">Grocery &amp; Food</option>
                    <option value="sports">Sports &amp; Fitness</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password (min 6 chars)"
                    value={registerForm.password}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, password: e.target.value });
                      if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: "" });
                    }}
                    className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                      registerErrors.password ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } rounded-xl text-xs font-semibold outline-none transition-all`}
                  />
                  {registerErrors.password && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {registerErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="mt-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition cursor-pointer text-xs uppercase tracking-wider"
              >
                {isRegistering ? "Generating Shop ID..." : "Register Shop & Generate Unique Shop ID 🚀"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: SELLER SHOP LOGIN */}
      {activeTab === "login" && !activeSeller && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-md mx-auto w-full">
          <form onSubmit={handleSellerLogin} className="flex flex-col gap-5">
            <div className="text-center border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-2 shadow-md">
                🔑
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Seller Shop Login
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Log in using your unique Shop ID (e.g. SHOP-849201) or Email.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Shop ID or Email *</label>
              <input
                type="text"
                required
                placeholder="e.g. SHOP-849201 or seller@stmart.com"
                value={loginForm.shopIdOrEmail}
                onChange={(e) => {
                  setLoginForm({ ...loginForm, shopIdOrEmail: e.target.value });
                  if (loginErrors.shopIdOrEmail) setLoginErrors({ ...loginErrors, shopIdOrEmail: "" });
                }}
                className={`px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  loginErrors.shopIdOrEmail ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                } rounded-xl text-xs font-semibold outline-none transition-all`}
              />
              {loginErrors.shopIdOrEmail && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  ⚠️ {loginErrors.shopIdOrEmail}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Password *</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm({ ...loginForm, password: e.target.value });
                  if (loginErrors.password) setLoginErrors({ ...loginErrors, password: "" });
                }}
                className={`px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  loginErrors.password ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                } rounded-xl text-xs font-semibold outline-none transition-all`}
              />
              {loginErrors.password && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  ⚠️ {loginErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition cursor-pointer text-xs uppercase tracking-wider"
            >
              {isLoggingIn ? "Authenticating..." : "Login to Seller Dashboard 🚀"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SELLER DASHBOARD (Active when logged in) */}
      {activeTab === "dashboard" && activeSeller && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Seller Profile Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-emerald-950 text-white border border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                🏬
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">
                    {activeSeller.storeName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-400 text-slate-950">
                    {activeSeller.shopId}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  👤 Owner: <strong>{activeSeller.ownerName}</strong> • 📧 {activeSeller.email} • 📞 {activeSeller.phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
              >
                ➕ Add New Product
              </button>

              <button
                onClick={handleSellerLogout}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Seller Listed Products Catalog */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  📦 My Listed Products ({sellerProducts.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Products listed under your Shop ID {activeSeller.shopId} live in store catalog.
                </p>
              </div>

              <button
                onClick={() => fetchSellerProducts(activeSeller.shopId)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className={isLoadingProducts ? "animate-spin" : ""}>🔄</span> Refresh List
              </button>
            </div>

            {sellerProducts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                <span className="text-4xl">📦</span>
                <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mt-2">
                  No Products Listed Yet
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Click "Add New Product" to list your first item live in the ST Mart catalog under your Shop ID.
                </p>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  ➕ Add Product Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerProducts.map((p) => (
                  <div key={p.id || p._id} className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-contain rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-1" />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h5>
                      <p className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">₹{Number(p.price).toLocaleString("en-IN")}</p>
                      <button
                        onClick={() => handleDeleteSellerProduct(p.id || p._id, p.name)}
                        className="text-[10px] font-bold text-rose-500 hover:underline mt-1 cursor-pointer"
                      >
                        🗑️ Delete Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL: ADD PRODUCT FROM DASHBOARD */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              ➕ Add New Product to Store Catalog
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Listing item under Shop ID: <strong className="text-emerald-600 dark:text-emerald-400">{activeSeller?.shopId}</strong>
            </p>

            <form onSubmit={handleAddSellerProduct} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  value={newProductForm.name}
                  onChange={(e) => {
                    setNewProductForm({ ...newProductForm, name: e.target.value });
                    if (productErrors.name) setProductErrors({ ...productErrors, name: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    productErrors.name ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                  } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none transition-all`}
                />
                {productErrors.name && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    ⚠️ {productErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="electronics" className="dark:bg-zinc-900">Electronics</option>
                    <option value="fashion" className="dark:bg-zinc-900">Fashion</option>
                    <option value="mobiles" className="dark:bg-zinc-900">Mobiles</option>
                    <option value="home" className="dark:bg-zinc-900">Home &amp; Kitchen</option>
                    <option value="grocery" className="dark:bg-zinc-900">Grocery</option>
                    <option value="sports" className="dark:bg-zinc-900">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Boat / Sony"
                    value={newProductForm.brand}
                    onChange={(e) => {
                      setNewProductForm({ ...newProductForm, brand: e.target.value });
                      if (productErrors.brand) setProductErrors({ ...productErrors, brand: "" });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      productErrors.brand ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none transition-all`}
                  />
                  {productErrors.brand && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {productErrors.brand}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1499"
                    value={newProductForm.price}
                    onChange={(e) => {
                      setNewProductForm({ ...newProductForm, price: e.target.value });
                      if (productErrors.price) setProductErrors({ ...productErrors, price: "" });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      productErrors.price ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none transition-all`}
                  />
                  {productErrors.price && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {productErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2999"
                    value={newProductForm.originalPrice}
                    onChange={(e) => {
                      setNewProductForm({ ...newProductForm, originalPrice: e.target.value });
                      if (productErrors.originalPrice) setProductErrors({ ...productErrors, originalPrice: "" });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      productErrors.originalPrice ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                    } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none transition-all`}
                  />
                  {productErrors.originalPrice && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      ⚠️ {productErrors.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProductForm.image}
                  onChange={(e) => {
                    setNewProductForm({ ...newProductForm, image: e.target.value });
                    if (productErrors.image) setProductErrors({ ...productErrors, image: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    productErrors.image ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                  } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none transition-all`}
                />
                {productErrors.image && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    ⚠️ {productErrors.image}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product description and details..."
                  value={newProductForm.desc}
                  onChange={(e) => {
                    setNewProductForm({ ...newProductForm, desc: e.target.value });
                    if (productErrors.desc) setProductErrors({ ...productErrors, desc: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    productErrors.desc ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                  } bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold outline-none resize-none transition-all`}
                />
                {productErrors.desc && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    ⚠️ {productErrors.desc}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                >
                  {isSubmittingProduct ? "Listing Product..." : "List Product Live 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SellerPortalPage;
