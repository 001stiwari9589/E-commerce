import { useEffect, useState } from "react";

function PaymentsHelpPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [openFaq, setOpenFaq] = useState(0);

  const paymentFaqs = [
    {
      q: "What payment methods are supported on AdrsMart?",
      a: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Maestro), Netbanking across all major banks, Cash on Delivery (COD), and No-Cost EMI options."
    },
    {
      q: "Is Cash on Delivery (COD) available for all orders?",
      a: "COD is available for most pincodes across India up to an order value of ₹20,000. Some high-value electronics or customized items may require online prepayment."
    },
    {
      q: "How does the refund process work if a payment fails?",
      a: "If money is deducted from your bank account during a failed transaction, your bank automatically refunds the full amount within 3-5 business days."
    },
    {
      q: "Are my credit card details secure?",
      a: "Yes! AdrsMart uses PCI-DSS Level 1 compliant payment gateways with 256-bit SSL encryption. We never store your full card number or CVV on our servers."
    }
  ];

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

      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Help & Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Payments & Options
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Everything you need to know about payment methods, safety, refunds, and zero-cost EMI on AdrsMart.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl text-center shadow-xs">
          <div className="text-2xl mb-1">⚡</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Instant UPI</h4>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Zero transaction fee</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl text-center shadow-xs">
          <div className="text-2xl mb-1">💳</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Cards & EMI</h4>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">No-Cost EMI up to 12m</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl text-center shadow-xs">
          <div className="text-2xl mb-1">💵</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Cash on Delivery</h4>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Pay at doorstep</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl text-center shadow-xs">
          <div className="text-2xl mb-1">🛡️</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">100% Secure</h4>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">256-bit Encryption</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-gray-100 dark:border-zinc-800">
          Payment FAQs
        </h2>

        {paymentFaqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 dark:border-zinc-850 pb-4 last:border-0">
            <button
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              className="w-full text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between py-2 cursor-pointer"
            >
              <span>{faq.q}</span>
              <span className="text-blue-600 dark:text-amber-400 text-lg font-black">{openFaq === index ? "−" : "+"}</span>
            </button>
            {openFaq === index && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed animate-fade-in pl-2 border-l-2 border-emerald-500">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentsHelpPage;
