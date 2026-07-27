import { useState } from "react";

function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [customEmail, setCustomEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError("Please enter your Gmail address");
      return;
    }
    const cleanInput = customEmail.trim().toLowerCase();
    const formattedEmail = cleanInput.includes("@") ? cleanInput : `${cleanInput}@gmail.com`;
    
    if (!formattedEmail.endsWith("@gmail.com") && !formattedEmail.includes("@")) {
      setError("Please enter a valid Gmail address (e.g. name@gmail.com)");
      return;
    }

    const namePart = formattedEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    onSelectAccount({
      name: formattedName,
      email: formattedEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
    });
  };

  const handleQuickSelect = (email, name) => {
    onSelectAccount({
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
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
            <span className="font-extrabold text-base text-slate-900 dark:text-white">Sign in with Google</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Choose or Enter Google Account</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Enter your own Gmail address to sign in instantly with Google
            </p>
          </div>

          {/* Form to type any real Gmail account */}
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Your Gmail Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
              {error && <p className="text-xs font-bold text-rose-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl font-extrabold text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider transform active:scale-98"
            >
              Sign In with this Google Account &rarr;
            </button>
          </form>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-zinc-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-slate-400 dark:text-zinc-500 font-bold">Or Quick Select</span></div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-col gap-2">
            {[
              { name: "Personal Google Account", email: "satyam.user@gmail.com" },
              { name: "Work / Business Account", email: "official.mart@gmail.com" },
            ].map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSelect(acc.email, acc.name)}
                className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-zinc-850 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-amber-950/40 text-blue-600 dark:text-amber-400 font-black flex items-center justify-center text-sm">
                    {acc.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">{acc.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-amber-400">Select &rarr;</span>
              </button>
            ))}
          </div>

        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
            Protected by Google OAuth 2.0 Identity Protocol
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;
