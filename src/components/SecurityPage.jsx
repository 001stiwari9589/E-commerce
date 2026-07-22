import { useEffect } from "react";

function SecurityPage({ onBack }) {
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

      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Trust & Safety
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Security & Safety First
        </h1>
        <p className="text-sm sm:text-base text-blue-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          How AdrsMart protects your personal information, payment credentials, and shopping safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">🔒</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">256-bit Encryption</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            All data transmitted between your browser and our servers is encrypted using bank-grade TLS 1.3 security protocols.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">🛡️</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Buyer Protection</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Guaranteed 100% genuine products directly from authorized brand distributors or verified sellers.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="text-2xl mb-1">⚠️</div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Anti-Scam Alert</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            AdrsMart employees will NEVER ask for your credit card OTP, account password, or UPI PIN over phone or SMS.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;
