import { useEffect } from "react";

function AboutUsPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store
      </button>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl z-10 relative">
          <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
            ✦ Empowering Commerce
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
            About AdrsMart
          </h1>
          <p className="text-sm sm:text-base text-blue-100 dark:text-zinc-300 mt-3 leading-relaxed">
            India’s fastest-growing e-commerce marketplace committed to delivering authentic products, lightning-fast shipping, and unmatched customer delight.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Impact Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-2xl text-center shadow-xs">
          <h3 className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-amber-400">50M+</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">Happy Customers</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-2xl text-center shadow-xs">
          <h3 className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-amber-400">100K+</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">Verified Sellers</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-2xl text-center shadow-xs">
          <h3 className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-amber-400">500+</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">Cities Delivered</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-2xl text-center shadow-xs">
          <h3 className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-amber-400">99.9%</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">On-Time Fulfillment</p>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 shadow-xs flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
          Our Vision & Core Principles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
              01
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">Customer First</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Every decision we make starts and ends with customer satisfaction, transparent pricing, and 100% genuine products.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
              02
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">Empowering MSMEs</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              We empower Indian artisans, small business owners, and local manufacturers to reach millions of digital shoppers seamlessly.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 flex items-center justify-center font-black">
              03
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">Innovation Leader</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Utilizing state-of-the-art AI recommendation algorithms and automated logistics pipelines for zero-delay operations.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AboutUsPage;
