import { useState, useEffect } from "react";
import { validatePincode, lookupPincode } from "../services/pincodeService";

function ProductDetailModal({ product, onClose, addToCart, onBuyNow, isWishlisted, toggleWishlist }) {
  const [pinInput, setPinInput] = useState("");
  const [pinResult, setPinResult] = useState(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleCheckPincode = async (e) => {
    e.preventDefault();
    const validation = validatePincode(pinInput);
    if (!validation.isValid) {
      setPinResult({ success: false, message: validation.message });
      return;
    }
    setIsCheckingPin(true);
    const res = await lookupPincode(pinInput);
    setIsCheckingPin(false);
    if (res.success) {
      setPinResult({
        success: true,
        message: `Express Delivery Available to ${res.area}, ${res.city} (${res.state})`,
        area: res.area,
        city: res.city,
        state: res.state,
      });
    } else {
      setPinResult({ success: false, message: res.error || "Pincode not deliverable." });
    }
  };

  if (!product) return null;

  // Custom specifications based on product category
  const getSpecs = () => {
    switch (product.category) {
      case "mobiles":
        return [
          { name: "Model", value: product.name },
          { name: "Display", value: "6.7-inch Super Retina XDR OLED" },
          { name: "Processor", value: "A17 Pro Bionic Chip" },
          { name: "Camera", value: "48MP Main + 12MP Ultra-Wide + 12MP Telephoto" },
          { name: "Battery", value: "4422 mAh with 25W Fast Charging" },
          { name: "OS", value: "iOS 17 (Upgradable to iOS 18)" },
        ];
      case "electronics":
        return [
          { name: "Device Type", value: product.name.includes("Watch") ? "Smart Watch" : product.name.includes("Headphone") ? "Wireless Headphone" : "Laptop" },
          { name: "Connectivity", value: "Bluetooth 5.3, Wi-Fi 6E" },
          { name: "Battery Life", value: product.name.includes("Watch") ? "Up to 36 Hours" : product.name.includes("Headphone") ? "Up to 40 Hours" : "Up to 18 Hours" },
          { name: "Features", value: "Active Noise Cancellation, Water Resistant" },
          { name: "Warranty", value: "1 Year Domestic Warranty" },
        ];
      case "fashion":
        return [
          { name: "Material", value: "100% Premium Cotton/Leather" },
          { name: "Fit", value: "Regular Fit / Comfort Sole" },
          { name: "Occasion", value: "Casual, Sporty & Smart Wear" },
          { name: "Care Instructions", value: "Machine Wash / Polish Only" },
        ];
      default:
        return [
          { name: "Type", value: product.name },
          { name: "Quality", value: "Premium Standard Certified" },
          { name: "Origin", value: "Made in India" },
          { name: "Warranty", value: "6 Months Seller Warranty" },
        ];
    }
  };

  const specs = getSpecs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-y-auto no-scrollbar flex flex-col animate-zoom-in text-slate-800 dark:text-zinc-100">
        
        {/* Header (sticky close button) */}
        <div className="sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 z-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate pr-6">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Image & Quick actions */}
          <div className="flex flex-col gap-6">
            <div className="relative bg-slate-50 dark:bg-zinc-850 rounded-xl p-6 flex items-center justify-center border border-slate-100 dark:border-zinc-800 group h-80 md:h-[400px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
              />
              {/* Wishlist Button floating inside Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 transform active:scale-90 cursor-pointer ${
                  isWishlisted
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                    : "bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isWishlisted ? "fill-current animate-heartbeat" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Tag indicator */}
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-md tracking-wider">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* CTA Buy Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addToCart(product);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 dark:shadow-none hover:shadow-xl transition-all cursor-pointer transform active:scale-98"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={() => {
                  onBuyNow(product);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-slate-900 dark:text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 dark:shadow-none hover:shadow-xl transition-all cursor-pointer transform active:scale-98"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Buy Now
              </button>
            </div>
          </div>

          {/* Right Column: Pricing, Specs, Description & Reviews */}
          <div className="flex flex-col gap-6">
            
            {/* Title & Rating */}
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-amber-500 uppercase tracking-wider">
                {product.brand || "Premium Brand"}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h1>

              {/* Rating badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  {product.rating || "4.4"}
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  {product.reviewsCount || "1,248"} Ratings & {product.comments?.length || "3"} Reviews
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-slate-400 dark:text-zinc-500 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                      {product.discount}% Off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 font-bold mt-1">
                Special Price inclusive of all taxes
              </p>
            </div>

            {/* Check Pincode & Area Availability */}
            <div className="p-4 bg-blue-50/50 dark:bg-zinc-800/60 border border-blue-100 dark:border-zinc-700/60 rounded-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Delivery & Area Availability
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Standard / Express</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  value={pinInput}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPinInput(clean);
                    if (clean.length < 6) setPinResult(null);
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={isCheckingPin || pinInput.length !== 6}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                >
                  {isCheckingPin ? "Finding..." : "Check PIN"}
                </button>
              </form>

              {pinResult && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-start gap-2 ${
                    pinResult.success
                      ? "bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-rose-100/70 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                  }`}
                >
                  <span className="text-sm">{pinResult.success ? "✓" : "❌"}</span>
                  <div>
                    <p>{pinResult.message}</p>
                    {pinResult.success && (
                      <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                        📦 Delivered within 2-3 business days. 100% Verified Online Payments.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                Product Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-350 leading-relaxed mt-2.5">
                {product.desc || "Experience top tier performance and quality built for everyday reliability. Packed with modern technologies, this design ensures you stay ahead in fashion and technology alike. Comes with a full warranty guarantee."}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                Specifications
              </h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 dark:border-zinc-800">
                <table className="w-full text-sm border-collapse text-left">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr
                        key={spec.name}
                        className={index % 2 === 0 ? "bg-slate-50/50 dark:bg-zinc-850/30" : "bg-transparent"}
                      >
                        <td className="px-4 py-2.5 font-semibold text-slate-500 dark:text-zinc-400 w-1/3 border-b border-slate-100 dark:border-zinc-800/50">
                          {spec.name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Reviews */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                Top Reviews
              </h3>
              <div className="flex flex-col gap-4 mt-3">
                {(product.comments || [
                  { name: "Rahul S.", rating: 5, comment: "Superb product! Exceeded my expectations. Build quality is premium.", date: "2 weeks ago" },
                  { name: "Ananya M.", rating: 4, comment: "Very good value for money, fast delivery. Highly recommended.", date: "1 month ago" }
                ]).map((rev, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{rev.name}</span>
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          {rev.rating} ★
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">{rev.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailModal;
