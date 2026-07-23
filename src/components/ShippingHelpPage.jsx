import { useEffect } from "react";

function ShippingHelpPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store
      </button>

      <div className="bg-gradient-to-r from-blue-700 via-sky-800 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Shipping & Delivery Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Fast & Reliable Shipping
        </h1>
        <p className="text-sm sm:text-base text-sky-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Learn about our delivery timelines, free shipping eligibility, express 24-hour dispatch, and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
            🚚
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Standard Shipping</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Delivered within 3 to 5 business days across 19,000+ pincodes in India. Free on orders above ₹499.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
            ⚡
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">ST Mart Express</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Same-day or next-day delivery available for select electronics and essentials in metro cities.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
            📍
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Live Tracking</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Receive real-time SMS & WhatsApp updates along with live courier GPS map tracking.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
          Shipping Policies at a Glance
        </h2>
        <ul className="flex flex-col gap-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed list-disc pl-5">
          <li><strong>Free Shipping:</strong> Applicable on all items with the "ST Mart Assured" badge when order total exceeds ₹499.</li>
          <li><strong>Packaging Integrity:</strong> All high-value items are shipped in tamper-evident sealed boxes with OTP verification at delivery.</li>
          <li><strong>Pincode Verification:</strong> Enter your pincode on product detail pages to get exact estimated delivery dates before placing an order.</li>
        </ul>
      </div>
    </div>
  );
}

export default ShippingHelpPage;
