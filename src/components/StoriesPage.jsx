import { useEffect } from "react";

function StoriesPage({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stories = [
    {
      id: 1,
      tag: "Seller Journey",
      title: "From a Small Jaipur Workshop to Shipping 50,000 Handicrafts Worldwide",
      author: "Rajesh Sharma",
      date: "July 12, 2026",
      snippet: "How AdrsMart Marketplace helped Rajasthan Artisans digitize traditional craftsmanship and reach global buyers directly.",
      readTime: "5 min read",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      tag: "Engineering",
      title: "How We Scaled Our Flash Sale Engine to Handle 100,000 Requests/Sec",
      author: "AdrsMart Tech Team",
      date: "June 28, 2026",
      snippet: "A deep dive into our distributed caching, database indexing, and low-latency checkout pipeline.",
      readTime: "8 min read",
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      id: 3,
      tag: "Sustainability",
      title: "100% Plastic-Free Packaging: Our Commitment to a Greener Future",
      author: "Eco Initiative Team",
      date: "June 15, 2026",
      snippet: "Transitioning all fulfillment hubs to biodegradable paper cartons and eco-friendly tape.",
      readTime: "4 min read",
      gradient: "from-emerald-500 to-teal-700"
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

      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          ✦ AdrsMart Stories
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
          Stories, Innovation & Impact
        </h1>
        <p className="text-sm sm:text-base text-purple-100 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl">
          Discover stories of seller empowerment, cutting-edge technology, and green initiatives powering AdrsMart across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className={`h-32 bg-gradient-to-br ${story.gradient} p-6 flex flex-col justify-between text-white relative`}>
              <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase self-start">
                {story.tag}
              </span>
              <span className="text-[11px] opacity-80 font-medium">{story.readTime}</span>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {story.snippet}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                <span>By {story.author}</span>
                <span>{story.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesPage;
