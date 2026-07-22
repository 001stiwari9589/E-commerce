import { useEffect } from "react";

const openPositions = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer (React & Node.js)",
    department: "Engineering",
    location: "Bengaluru (Hybrid)",
    type: "Full-Time",
  },
  {
    id: 2,
    title: "Lead UI/UX Product Designer",
    department: "Design",
    location: "Remote / Bengaluru",
    type: "Full-Time",
  },
  {
    id: 3,
    title: "Supply Chain & Logistics Manager",
    department: "Operations",
    location: "Mumbai Hub",
    type: "Full-Time",
  },
  {
    id: 4,
    title: "Performance Marketing Lead",
    department: "Marketing",
    location: "Delhi NCR",
    type: "Full-Time",
  },
];

function CareersPage({ onBack, triggerToast }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApply = (title) => {
    triggerToast(`Application initiated for ${title}! We will reach out via email.`, "success");
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

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
            ✦ Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-tight">
            Build the Future of Indian E-Commerce
          </h1>
          <p className="text-sm sm:text-base text-purple-100 dark:text-zinc-300 mt-3 leading-relaxed">
            We are looking for passionate problem solvers, builders, and innovators who want to make a lasting impact on millions of lives.
          </p>
        </div>
      </div>

      {/* Open Positions List */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Current Openings ({openPositions.length})
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
            Hiring across Engineering, Product &amp; Ops
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {openPositions.map((job) => (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-amber-500 transition-all gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 dark:bg-amber-950/60 text-blue-700 dark:text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                    {job.department}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">• {job.type}</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  📍 {job.location}
                </p>
              </div>

              <button
                onClick={() => handleApply(job.title)}
                className="self-start sm:self-center px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all shrink-0"
              >
                Apply Now ↗
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CareersPage;
