function AffiliateDisclosureBanner({ setView, compact = false }) {
  if (compact) {
    return (
      <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 rounded-xl p-2.5 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-bold text-blue-600 dark:text-amber-400 shrink-0">
            Affiliate Notice:
          </span>
          <span className="truncate">
            SmartDeals.in earns commission from qualifying purchases on Amazon India at zero extra cost to you.
          </span>
        </div>
        {setView && (
          <button
            onClick={() => setView("affiliate-disclosure")}
            className="text-blue-600 dark:text-amber-400 hover:underline font-bold shrink-0 cursor-pointer"
          >
            Learn More
          </button>
        )}
      </div>
    );
  }

  return (
    <aside aria-label="Affiliate Disclosure" className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 my-6 text-slate-700 dark:text-zinc-300 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-amber-500/15 text-blue-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Transparent Affiliate Disclosure
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
            SmartDeals.in is an independent recommendation platform and participant in the Amazon Associates Program. When you click our partner links and make a qualifying purchase, we earn an affiliate commission at <strong>no additional cost to you</strong>. All orders, payments, and shipping are handled directly by Amazon India.
          </p>
          {setView && (
            <button
              onClick={() => setView("affiliate-disclosure")}
              className="mt-2 text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Read our full Affiliate Disclosure & Editorial Policy →
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default AffiliateDisclosureBanner;
