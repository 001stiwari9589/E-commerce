import { useEffect } from "react";

function ReturnPolicyPage({ onBack }) {
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

      <div className="bg-gradient-to-r from-slate-800 via-zinc-800 to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Legal & Policy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          ST Mart Return Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Comprehensive guideline detailing eligible items, timelines, conditions, and replacement policies.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Return Window by Category</h2>
          <p>• <strong>Electronics & Mobiles:</strong> 7 Days Replacement / Return for defective or dead-on-arrival items.</p>
          <p>• <strong>Fashion & Lifestyle:</strong> 10 Days Return / Size Exchange provided tags remain intact.</p>
          <p>• <strong>Home & Kitchen Essentials:</strong> 7 Days Return in original condition with box.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Conditions for a Valid Return</h2>
          <p>• Product must be in unused condition with original price tags, brand outer box, and accessories.</p>
          <p>• Serial number / IMEI on the box must match our inventory records.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Non-Returnable Categories</h2>
          <p>• Innerwear, personal hygiene products, customized items, and downloadable software licenses.</p>
        </section>
      </div>
    </div>
  );
}

export default ReturnPolicyPage;
