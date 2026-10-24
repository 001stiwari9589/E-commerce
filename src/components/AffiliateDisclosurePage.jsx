function AffiliateDisclosurePage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in text-slate-800 dark:text-zinc-200">
      {/* Header & Back */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to ST Mart
      </button>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-zinc-800 px-3 py-1 rounded-full text-blue-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          Transparency & Compliance
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Affiliate Program Disclosure
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          Last Updated: October 2026 • In compliance with FTC, Flipkart, and Amazon Associates policies
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
          <section className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-150 dark:border-zinc-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              1. What is ST Mart's Affiliate Model?
            </h2>
            <p>
              ST Mart operates as a consumer-first curation and recommendation platform. We do not manufacture, stock, or directly ship third-party inventory. Instead, we research, test, and recommend products that provide high utility and value across categories such as <strong>Electronics, Mobile Accessories, Computer Accessories, Home & Kitchen, and Student Essentials</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              2. How Do We Earn Revenue?
            </h2>
            <p>
              When you click on an external product link on ST Mart (such as links directed to <strong>Flipkart</strong> or <strong>Amazon India</strong>) and complete a qualifying purchase, the merchant pays us a small referral commission.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-zinc-300">
              <li><strong>Zero Extra Cost to You:</strong> You pay the exact same price (or lower during sales) as any other regular customer visiting the merchant directly.</li>
              <li><strong>No Secret Markups:</strong> We never add any hidden fees or price inflation.</li>
              <li><strong>Secure Merchant Transactions:</strong> Your payment, order processing, shipping, warranties, and returns are handled directly by the authorized merchant (e.g. Flipkart, Amazon).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3. Amazon Associates Statement
            </h2>
            <p>
              <em>"ST Mart is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in / Amazon.com."</em>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              4. Flipkart Affiliate Program Statement
            </h2>
            <p>
              Certain links on ST Mart are tracked affiliate links connected with the Flipkart Affiliate Program. When users navigate to Flipkart through our verified links and purchase qualifying items, ST Mart may receive remuneration according to Flipkart's current affiliate commission schedule.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              5. Editorial Independence & Price Verification
            </h2>
            <p>
              Merchant commissions never influence whether a product is recommended. We do not invent ratings, fake discounts, or artificial reviews. All displayed product prices represent estimated or verified values at the time of catalog updates. Because prices change dynamically on e-commerce platforms, please always verify the current price directly on the merchant's landing page before completing your checkout.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              6. Have Questions or Feedback?
            </h2>
            <p>
              If you have any questions regarding our affiliate disclosures or product curation policies, feel free to contact us at: <a href="mailto:support@stmart.in" className="text-blue-600 dark:text-amber-400 font-semibold hover:underline">support@stmart.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AffiliateDisclosurePage;
