import { useEffect, useState } from "react";

function FAQPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [search, setSearch] = useState("");

  const faqs = [
    { cat: "Orders", q: "How do I track my order?", a: "Go to your Profile -> My Orders, and click on 'Track Package' to see real-time updates." },
    { cat: "Orders", q: "Can I change my delivery address after placing an order?", a: "Yes, you can edit your address from the order details page before the item is dispatched." },
    { cat: "Account", q: "How do I reset my password or login details?", a: "Click on 'Login' in the header, enter your phone or email, and click 'Send OTP' to log in securely." },
    { cat: "Returns", q: "What is the return window for electronics?", a: "Electronics carry a 7-day replacement guarantee for manufacturing defects or damage during transit." },
    { cat: "Payments", q: "Do you offer No-Cost EMI on credit cards?", a: "Yes! No-Cost EMI is available on HDFC, ICICI, SBI, and Axis Bank credit cards for purchases above ₹3,000." }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase()) ||
    f.cat.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="bg-gradient-to-r from-cyan-600 via-blue-700 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ 24x7 Help Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          How Can We Help You?
        </h1>
        <div className="mt-6 max-w-xl">
          <input
            type="text"
            placeholder="Search FAQs, topics or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl text-slate-900 font-medium text-sm focus:outline-none shadow-lg bg-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1.5">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-amber-400 tracking-wider">{faq.cat}</span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
