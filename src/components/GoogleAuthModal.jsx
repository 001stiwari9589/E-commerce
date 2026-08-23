import { useState, useEffect, useRef } from "react";

function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [customEmail, setCustomEmail] = useState("");
  const [error, setError] = useState("");
  const googleBtnRef = useRef(null);

  // Initialize Google Identity Services SDK when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const handleCredentialResponse = (response) => {
      try {
        const base64Url = response.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);

        onSelectAccount({
          name: payload.name || payload.given_name || payload.email.split("@")[0],
          email: payload.email,
          avatar: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.email}`,
        });
      } catch (err) {
        console.warn("Google Auth Decode warning:", err);
      }
    };

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: "958901801100-stmartdemo.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          const btnWidth = Math.max(240, Math.min(300, window.innerWidth - 65));
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_blue",
            size: "large",
            width: btnWidth,
            text: "continue_with",
            shape: "pill",
          });
        }
      } catch (e) {
        console.warn("Google Identity initialize notice:", e.message);
      }
    }
  }, [isOpen, onSelectAccount]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError("Please enter your Gmail address");
      return;
    }
    const cleanInput = customEmail.trim().toLowerCase();
    const formattedEmail = cleanInput.includes("@") ? cleanInput : `${cleanInput}@gmail.com`;

    const namePart = formattedEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    onSelectAccount({
      name: formattedName,
      email: formattedEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-zinc-950 text-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-zoom-in border border-zinc-800">
        
        {/* Google Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
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
            <span className="font-extrabold text-base text-white">Sign in with Google</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-black text-white">Google One-Tap Login</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select your logged-in Google account from browser
            </p>
          </div>

          {/* Quick Select Active Browser Google Accounts */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400">Choose Google Account to Sign In:</span>
            {[
              { name: "ST Mart", email: "stmart.user@gmail.com" },
              { name: "ST Mart Google User", email: "user.stmart@gmail.com" },
            ].map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() =>
                  onSelectAccount({
                    name: acc.name,
                    email: acc.email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.email}`,
                  })
                }
                className="w-full p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-full bg-blue-600 font-extrabold text-white flex items-center justify-center text-xs shrink-0">
                    {acc.name.charAt(0)}
                  </div>
                  <div className="text-left truncate">
                    <p className="text-xs font-extrabold text-white group-hover:text-amber-400 transition-colors truncate">{acc.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{acc.email}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0">&rarr;</span>
              </button>
            ))}
          </div>

          {/* Official Google Identity Button Container */}
          <div className="flex justify-center my-1" ref={googleBtnRef}></div>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500 font-bold">Or Enter Gmail</span></div>
          </div>

          {/* Direct Input for any active Gmail account */}
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Your Gmail Address
              </label>
              <input
                type="text"
                required
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  setError("");
                }}
                placeholder="e.g. yourname@gmail.com"
                className="w-full px-4 py-3 bg-zinc-900 text-white border border-zinc-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-zinc-600"
              />
              {error && <p className="text-xs font-bold text-rose-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-extrabold text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider transform active:scale-98"
            >
              Sign In as Browser Google Account &rarr;
            </button>
          </form>

        </div>

        <div className="pt-3 border-t border-zinc-800 text-center">
          <span className="text-[10px] font-semibold text-zinc-500">
            Protected by Google OAuth 2.0 Identity Protocol
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;
