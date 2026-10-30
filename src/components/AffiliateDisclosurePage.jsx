function AffiliateDisclosurePage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in text-slate-800 dark:text-zinc-200">
      {/* Header & Back */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to SmartDeals
      </button>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 dark:bg-amber-400/10 px-3 py-1 rounded-full text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
          Transparency &amp; Compliance
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Affiliate Program Disclosure
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Last Updated: October 2026 • In compliance with FTC and Amazon Associates policies
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          {/* Section 1: Proper contrast container */}
          <section className="bg-slate-100/90 dark:bg-zinc-800 p-5 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-amber-400 mb-2">
              1. What is SmartDeals' Affiliate Model?
            </h2>
            <p className="text-slate-800 dark:text-zinc-200">
              SmartDeals.in operates as an independent curation and price discovery recommendation platform. We do not manufacture, stock, or directly ship third-party inventory. Instead, we research, test, and recommend products that provide high utility and value across categories such as <strong>Electronics, Mobile Accessories, Computer Accessories, Home &amp; Kitchen, and Student Essentials</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              2. How Do We Earn Revenue?
            </h2>
            <p>
              When you click on an external product link on SmartDeals (such as links directed to <strong>Amazon India</strong>) and complete a qualifying purchase, the merchant pays us a small referral commission.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-zinc-300">
              <li><strong>Zero Extra Cost to You:</strong> You pay the exact same price (or lower during sales) as any other regular customer visiting the merchant directly.</li>
              <li><strong>No Secret Markups:</strong> We never add any hidden fees or price inflation.</li>
              <li><strong>Secure Merchant Transactions:</strong> Your payment, order processing, shipping, warranties, and returns are handled directly by Amazon India.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3. Amazon Associates Statement
            </h2>
            <p className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
              <em>"SmartDeals.in is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in."</em>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              4. Editorial Independence &amp; Price Verification
            </h2>
            <p>
              Merchant commissions never influence whether a product is recommended. We do not invent ratings, fake discounts, or artificial reviews. All displayed product prices represent estimated or verified values at the time of catalog updates. Because prices change dynamically on e-commerce platforms, please always verify the current price directly on the merchant's landing page before completing your checkout.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              5. Have Questions or Feedback?
            </h2>
            <p>
              If you have any questions regarding our affiliate disclosures or product curation policies, feel free to contact us at: <a href="mailto:support@smartdeals.in" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">support@smartdeals.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AffiliateDisclosurePage;
