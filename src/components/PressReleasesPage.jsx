import { useEffect } from "react";

function PressReleasesPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const pressItems = [
    {
      date: "July 10, 2026",
      title: "ST Mart Launches AI-Powered Personal Shopper & Ultra-Fast 24-Hour Delivery in Top Metro Cities",
      category: "Corporate Announcement",
      summary: "ST Mart introduces next-generation AI recommendation models along with 24-hour fulfillment centers operating across Bengaluru, Mumbai, and Delhi NCR."
    },
    {
      date: "May 18, 2026",
      title: "ST Mart Onboards 25,000+ Rural Artisans Under National Craft Empowerment Drive",
      category: "Community Impact",
      summary: "Partnering with state craft boards, ST Mart enables rural micro-entrepreneurs to sell direct-to-consumer with zero onboarding fees."
    },
    {
      date: "March 04, 2026",
      title: "ST Mart Reports 180% YoY Growth in Annual Electronics & Smart Appliance Sales",
      category: "Financial Results",
      summary: "Driven by affordable EMI plans and seamless exchange offers, ST Mart solidifies its leadership position in consumer electronics."
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

      <div className="bg-gradient-to-r from-slate-900 via-zinc-800 to-blue-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ Newsroom & Press Releases
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          ST Mart Press Room
        </h1>
        <p className="text-sm sm:text-base text-slate-300 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Official news, company updates, media resources, and corporate press releases from ST Mart India.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
          Latest Announcements
        </h2>

        <div className="flex flex-col gap-6">
          {pressItems.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-850 flex flex-col gap-2 border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 text-xs font-bold text-blue-600 dark:text-amber-400">
                <span>{item.category}</span>
                <span>•</span>
                <span className="text-slate-400 dark:text-zinc-500 font-normal">{item.date}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Media Inquiries Card */}
      <div className="bg-blue-50 dark:bg-zinc-850 border border-blue-150 dark:border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Media & PR Inquiries</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">For press kits, interviews, and official statements contact press@ST Mart.com</p>
        </div>
        <a href="mailto:press@ST Mart.com" className="bg-blue-600 dark:bg-amber-500 text-white dark:text-zinc-950 px-5 py-2 rounded-xl text-xs font-bold shrink-0 hover:bg-blue-700 transition-colors">
          Contact Press Office
        </a>
      </div>
    </div>
  );
}

export default PressReleasesPage;
