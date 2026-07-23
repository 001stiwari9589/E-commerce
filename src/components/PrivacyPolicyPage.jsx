import { useEffect } from "react";

function PrivacyPolicyPage({ onBack }) {
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

      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Privacy Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-purple-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Detailed transparency on how your data is collected, stored, and protected under Digital Personal Data Protection laws.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect essential details such as name, email, phone number, shipping address, and order history strictly for processing your transactions and delivering your products.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. No Selling of Data</h2>
          <p>ST Mart will never sell, rent, or trade your personal information to third-party advertisers or unauthorized data brokers.</p>
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Cookies & Preferences</h2>
          <p>We use localized browser cookies to remember your theme preferences (Dark Mode), cart items, and wishlist selections locally.</p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
