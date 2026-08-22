import { useState, useEffect } from "react";
import { apiService } from "../services/api";

function SellerPortalPage({ onBack, triggerToast, onAddProduct }) {
  const [formData, setFormData] = useState({
    sellerName: "",
    productName: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: "electronics",
    image: "",
    desc: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.price) {
      if (triggerToast) triggerToast("Please enter product name and price!", "warning");
      return;
    }

    setIsSubmitting(true);

    const numPrice = Number(formData.price);
    const numMRP = formData.originalPrice ? Number(formData.originalPrice) : numPrice;

    const payload = {
      name: formData.productName.trim(),
      brand: formData.brand.trim() || formData.sellerName.trim() || "ST Mart Seller",
      price: numPrice,
      originalPrice: numMRP,
      category: formData.category.toLowerCase(),
      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
      desc: formData.desc.trim() || `Listed by verified seller ${formData.sellerName || "ST Mart Seller"}.`,
    };

    try {
      // 1. Add via Backend API
      const res = await apiService.addProduct(payload);
      const newCard = res && (res.data || res.product) ? (res.data || res.product) : { ...payload, id: Date.now() };

      setCreatedProduct(newCard);

      // 2. Trigger global state update to display live card on store
      if (onAddProduct) {
        await onAddProduct(newCard);
      }

      if (triggerToast) {
        triggerToast(`Product "${payload.name}" listed live in ST Mart Database! 🚀`, "success");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Seller Portal error:", err);
      if (triggerToast) triggerToast("Failed to list product. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCreatedProduct(null);
    setFormData({
      sellerName: "",
      productName: "",
      brand: "",
      price: "",
      originalPrice: "",
      category: "electronics",
      image: "",
      desc: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-4">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store Catalog
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
            ✦ ST Mart Seller Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
            Sell on ST Mart &amp; List Your Products Live
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 dark:text-zinc-300 mt-3 leading-relaxed">
            Reach millions of shoppers across India. Add your products directly to the ST Mart store database catalog!
          </p>
        </div>
      </div>

      {/* Seller Onboarding & Product Addition Form */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl font-black shadow-md">
              ✓
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Product Listed Live on ST Mart!
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md">
              <strong>"{createdProduct?.name}"</strong> is now saved in the MongoDB database and visible live in the store catalog.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                ➕ Add Another Product
              </button>

              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                🛍️ View Live Store Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Seller Product Listing Portal 📦
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Enter details below to list a new product card live in the ST Mart database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Seller / Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Satyam Enterprises"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise Cancelling Earbuds"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="electronics" className="dark:bg-zinc-900">Electronics &amp; Gadgets</option>
                  <option value="fashion" className="dark:bg-zinc-900">Fashion &amp; Apparel</option>
                  <option value="mobiles" className="dark:bg-zinc-900">Mobiles &amp; Accessories</option>
                  <option value="home" className="dark:bg-zinc-900">Home &amp; Kitchen</option>
                  <option value="appliances" className="dark:bg-zinc-900">Large Appliances</option>
                  <option value="grocery" className="dark:bg-zinc-900">Grocery &amp; Food</option>
                  <option value="sports" className="dark:bg-zinc-900">Sports &amp; Fitness</option>
                  <option value="toys" className="dark:bg-zinc-900">Beauty &amp; Toys</option>
                  <option value="books" className="dark:bg-zinc-900">Books &amp; Stationery</option>
                  <option value="footwear" className="dark:bg-zinc-900">Footwear &amp; Shoes</option>
                  <option value="gaming" className="dark:bg-zinc-900">Gaming &amp; Gear</option>
                  <option value="jewelry" className="dark:bg-zinc-900">Jewelry &amp; Watches</option>
                  <option value="automotive" className="dark:bg-zinc-900">Auto &amp; Car Accessories</option>
                  <option value="pets" className="dark:bg-zinc-900">Pet Supplies</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sony / Boat / Apple"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Original Price / M.R.P (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2999"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Product Description</label>
              <textarea
                rows={3}
                placeholder="Product description, warranty, key features..."
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm tracking-wide"
            >
              {isSubmitting ? "Listing Product..." : "List Product Live in Store Catalog 🚀"}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

export default SellerPortalPage;
