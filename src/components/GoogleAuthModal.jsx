import { useState } from "react";

function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [customEmail, setCustomEmail] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: "AdrsMart User",
      email: "user.google@gmail.com",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    },
    {
      name: "Demo Customer",
      email: "demo.shopper@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const formattedEmail = customEmail.includes("@") ? customEmail : `${customEmail}@gmail.com`;
    onSelectAccount({
      name: formattedEmail.split("@")[0],
      email: formattedEmail,
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-800 dark:text-zinc-150 animate-zoom-in border border-gray-150 dark:border-zinc-800">
        
        {/* Google Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-extrabold text-sm text-slate-800 dark:text-white">Sign in with Google</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-black text-slate-900 dark:text-white">Choose an account</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">to continue to AdrsMart Store</p>

          {!isCustomMode ? (
            <div className="flex flex-col gap-2 mt-4">
              {defaultAccounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => onSelectAccount(acc)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-150 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 active:bg-slate-100 dark:active:bg-zinc-800 focus:outline-none transition-colors cursor-pointer text-left w-full group"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-500 transition-colors">
                      {acc.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{acc.email}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select ➔
                  </span>
                </button>
              ))}

              <button
                onClick={() => setIsCustomMode(true)}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all cursor-pointer text-left w-full mt-1"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-black text-slate-500 text-lg">
                  +
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Use another Google account</h5>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Sign in with custom @gmail.com</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Enter Google Email Address</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:border-blue-500 dark:focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="w-1/3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-center">
          <span className="text-[10px] text-slate-400 dark:text-zinc-550">
            Protected by Google OAuth 2.0 Identity Protocol
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;
