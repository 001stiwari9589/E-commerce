import { useEffect } from "react";

function TermsOfUsePage({ onBack }) {
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

      <div className="bg-gradient-to-r from-zinc-800 via-slate-800 to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Legal Terms
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Terms Of Use
        </h1>
        <p className="text-sm sm:text-base text-slate-300 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Rules, conditions, and rights governing the access and usage of ST Mart platform services.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. User Agreement & Acceptable Use</h2>
          <p>By accessing ST Mart, you agree to comply with Indian e-commerce rules, IT Act regulations, and respectful code of conduct without attempting fraudulent activities or automated scraping.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Product Pricing & Specifications</h2>
          <p>Prices and stock availability are subject to seller updates. In case of pricing typographical errors, ST Mart reserves the right to cancel unfulfilled orders with 100% refund.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Intellectual Property Rights</h2>
          <p>All logos, UI components, code, graphics, and trademarks are owned by ST Mart Private Limited.</p>
        </section>
      </div>
    </div>
  );
}

export default TermsOfUsePage;
