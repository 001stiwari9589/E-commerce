import { useEffect } from "react";

function ReturnsHelpPage({ onBack }) {
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

      <div className="bg-gradient-to-r from-rose-600 via-pink-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Easy Returns & Cancellation
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Hassle-Free Returns
        </h1>
        <p className="text-sm sm:text-base text-rose-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Change your mind or received a defective product? Return or exchange seamlessly within 7 days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-sm">
            01
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">1. Request Return</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Go to "My Orders", click on the delivered item, and select "Request Return or Exchange".
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-sm">
            02
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">2. Free Doorstep Pickup</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Our delivery executive will pick up the item from your doorstep with quality check verification.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-3xl flex flex-col gap-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-sm">
            03
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">3. Instant Refund</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            As soon as pickup is confirmed, refunds are initiated immediately to your bank or original payment method.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
          Cancellation Policy
        </h2>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          Orders can be cancelled anytime before dispatch with a 100% full refund. Once shipped, you can reject delivery at doorstep or initiate a return post-delivery.
        </p>
      </div>
    </div>
  );
}

export default ReturnsHelpPage;
