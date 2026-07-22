import { useState, useEffect } from "react";

function ContactUsPage({ onBack, triggerToast }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerToast("Thank you for reaching out! Our support team will get back to you within 2 hours.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store
      </button>

      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 dark:text-amber-400 uppercase tracking-widest block">
            ✦ 24x7 Customer Support
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Contact Us & Help Center
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 max-w-lg">
            Have questions about orders, refunds, or seller onboarding? We are available 24/7 to assist you.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-blue-50 dark:bg-zinc-850 p-4 rounded-2xl border border-blue-100 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center font-bold">
            ☎
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block">Toll-Free Helpline</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">1800-200-ADRS (2377)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Info */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3">
            Send us a Direct Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Your Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-blue-500 dark:focus:border-amber-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-blue-500 dark:focus:border-amber-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Order Inquiry / Account Issue"
              className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-blue-500 dark:focus:border-amber-500 transition-all placeholder-gray-400 dark:placeholder-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your issue or query in detail..."
              className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-blue-500 dark:focus:border-amber-500 transition-all placeholder-gray-400 dark:placeholder-zinc-650"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm"
          >
            Submit Support Request
          </button>
        </form>

        {/* Office Details Side Card */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3">
              Headquarters Office
            </h3>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">AdrsMart India Pvt. Ltd.</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed mt-0.5">
                  Embassy Tech Village, Outer Ring Road,<br />
                  Devarabeesanahalli Village, Bengaluru,<br />
                  Karnataka - 560103.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">Email Support</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">support@adrs-mart.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ContactUsPage;
