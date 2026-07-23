import { useState, useEffect } from "react";

function SellerPortalPage({ onBack, triggerToast, onAddProduct }) {
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    gstin: "",
    category: "electronics",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onAddProduct) {
      await onAddProduct({
        name: formData.storeName,
        brand: formData.email || "Generic",
        price: Number(formData.phone) || 999,
        originalPrice: Number(formData.gstin) || Number(formData.phone) || 1299,
        category: formData.category,
        desc: "Newly listed product in database catalog.",
      });
    } else {
      triggerToast(`Product ${formData.storeName} saved!`, "success");
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
            ✦ 0% Commission for 30 Days
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
            Sell on ST Mart &amp; Grow Your Business 10x
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 dark:text-zinc-300 mt-3 leading-relaxed">
            Join 100,000+ successful Indian sellers reaching over 50 crore registered customers nationwide.
          </p>
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            📦
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">19,000+ Pincodes</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Deliver products to every corner of India with ST Mart Logistics.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            💰
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">7-Day Payments</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Get your funds directly credited to your bank account in 7 days.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">10-Min Setup</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Simple GSTIN &amp; PAN verification to start listing products instantly.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            📈
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">Seller Analytics</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Real-time demand forecasting and inventory management tools.</p>
        </div>
      </div>

      {/* Seller Onboarding Form */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Seller Account &amp; Product Registered!
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md">
              Your product has been saved to the Database catalog! You can view it live in the store catalog now.
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Back to Store Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Add New Product to Database Catalog 📦
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                Fill in details below. Data will be saved directly into the backend Database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Product Title / Name</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="e.g. Wireless Noise Cancelling Earbuds"
                  className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. Sony / Boat / Apple"
                  className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 2999"
                  className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Original Price / M.R.P (₹)</label>
                <input
                  type="number"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="e.g. 4999"
                  className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="electronics">Electronics &amp; Gadgets</option>
                  <option value="fashion">Fashion &amp; Apparel</option>
                  <option value="mobiles">Mobiles &amp; Accessories</option>
                  <option value="home">Home &amp; Kitchen</option>
                  <option value="appliances">Large Appliances</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm tracking-wide"
            >
              Add Product to Database 🚀
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

export default SellerPortalPage;
