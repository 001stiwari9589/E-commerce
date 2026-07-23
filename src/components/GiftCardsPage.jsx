import { useEffect, useState } from "react";

function GiftCardsPage({ onBack, triggerToast }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [amount, setAmount] = useState(1000);
  const [recipientEmail, setRecipientEmail] = useState("");

  const handlePurchase = (e) => {
    e.preventDefault();
    if (!recipientEmail) return;
    if (triggerToast) {
      triggerToast(`₹${amount} Gift Card sent to ${recipientEmail}! 🎉`, "success");
    }
    setRecipientEmail("");
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

      <div className="bg-gradient-to-r from-pink-600 via-rose-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Instant e-Gift Cards
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          ST Mart Gift Cards
        </h1>
        <p className="text-sm sm:text-base text-pink-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Give the gift of choice! Instantly email digital gift cards for birthdays, anniversaries, or celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gift Card Preview */}
        <div className="bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="font-extrabold italic text-xl tracking-wider">ST Mart✦ Gift Card</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold">Instant Delivery</span>
          </div>

          <div className="z-10 mt-6">
            <span className="text-xs uppercase tracking-widest opacity-80 font-semibold">Value Amount</span>
            <h3 className="text-4xl font-black mt-1">₹{amount.toLocaleString("en-IN")}</h3>
          </div>

          <div className="flex items-center justify-between z-10 border-t border-white/20 pt-4 text-xs">
            <span>Valid for 1 Year across all products</span>
            <span className="font-bold">CODE: GIFT-2026-ADRS</span>
          </div>

          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Purchase Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Gift Card Amount</h2>

          <div className="flex items-center gap-3">
            {[500, 1000, 2500, 5000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer border ${
                  amount === val
                    ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-zinc-950 border-blue-600 dark:border-amber-500 shadow-md"
                    : "bg-slate-50 dark:bg-zinc-850 text-slate-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:border-blue-400"
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          <form onSubmit={handlePurchase} className="flex flex-col gap-3 mt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Recipient Email Address</label>
            <input
              type="email"
              placeholder="friend@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-medium focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-600 text-white dark:text-zinc-950 font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md mt-2"
            >
              Send Gift Card Now (₹{amount})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GiftCardsPage;
