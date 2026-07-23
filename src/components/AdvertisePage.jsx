import { useEffect } from "react";

function AdvertisePage({ onBack, triggerToast }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    if (triggerToast) {
      triggerToast("Advertising inquiry submitted! Our Brand Manager will reach out shortly.", "success");
    }
  };

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

      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-slate-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ ST Mart Ads Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Advertise With ST Mart
        </h1>
        <p className="text-sm sm:text-base text-amber-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Reach 50 Million+ active shoppers across India with targeted search ads, homepage banners, and sponsored product placements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">📈</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Sponsored Search</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Place your products on top of search results when buyers look for relevant keywords in your category.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">🎯</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Homepage Banners</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Maximum brand visibility with premium hero carousel positioning during festive sales and product launches.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">📊</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Real-Time Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Comprehensive dashboard to track Impressions, Clicks, Conversion Rate, and Return on Ad Spend (ROAS).
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Request Advertising Consultation</h2>
        <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Brand / Company Name" required className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-medium focus:outline-none" />
          <input type="email" placeholder="Work Email Address" required className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-medium focus:outline-none" />
          <input type="tel" placeholder="Phone Number" required className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-medium focus:outline-none" />
          <select className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-medium focus:outline-none text-slate-700 dark:text-zinc-300">
            <option>Monthly Budget: ₹50,000 - ₹2,00,000</option>
            <option>Monthly Budget: ₹2,00,000 - ₹10,00,000</option>
            <option>Monthly Budget: ₹10,00,000+</option>
          </select>
          <button type="submit" className="sm:col-span-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer">
            Submit Advertising Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdvertisePage;
