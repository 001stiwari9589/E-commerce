import { useState, useEffect } from "react";

function DownloadAppModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed & running as app)
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(isInStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Capture Chrome/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredInstallPrompt = e;
    };

    if (window.deferredInstallPrompt) {
      setDeferredPrompt(window.deferredInstallPrompt);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setDeferredPrompt(null);
      window.deferredInstallPrompt = null;
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [onClose]);

  if (!isOpen || isStandalone) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setInstallSuccess(true);
          setTimeout(() => {
            if (onClose) onClose();
          }, 2000);
        }
        setDeferredPrompt(null);
        window.deferredInstallPrompt = null;
      } catch (err) {
        console.warn("Install prompt notice:", err);
      }
    } else {
      setShowIOSInstructions(!showIOSInstructions);
    }
  };

  return (
    // Compact Top Floating Popup (No background dim, sleek & non-blocking)
    <div className="fixed top-3 right-3 sm:top-4 sm:right-6 z-50 max-w-sm w-[92%] sm:w-[370px] pointer-events-auto animate-slide-down">
      <div className="bg-slate-950/95 dark:bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border-2 border-amber-400 dark:border-amber-500/80 flex flex-col gap-2">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2.5">
          {/* App Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-base">
                🛍️
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-white tracking-tight truncate">
                  SmartDeals<span className="text-amber-400">.in</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-500/30 uppercase">
                  App
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 font-semibold truncate">
                ⚡ 1-Click Amazon Loot Deals &amp; Alerts
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300">
            <span className="text-amber-400 font-black">★ 4.9</span>
            <span>•</span>
            <span className="text-emerald-400 font-black">Free (2.4 MB)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-bold text-zinc-400 hover:text-white px-2 py-1 transition cursor-pointer"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📥 Install</span>
            </button>
          </div>
        </div>

        {/* Step-by-step Tip for iOS / fallback */}
        {showIOSInstructions && (
          <div className="bg-amber-400/15 border border-amber-400/40 rounded-xl p-2 text-[10px] font-semibold text-amber-200 animate-fade-in">
            {isIOS ? (
              <span>📲 Safari mein neeche <strong>Share (📤)</strong> dabayein &rarr; <strong>'Add to Home Screen (➕)'</strong> chunein.</span>
            ) : (
              <span>📲 Browser menu <strong>(⋮)</strong> dabayein &rarr; <strong>'Install app'</strong> ya <strong>'Add to Home screen'</strong> chunein.</span>
            )}
          </div>
        )}

        {installSuccess && (
          <div className="bg-emerald-500 text-white rounded-xl p-2 text-center text-xs font-bold animate-bounce">
            ✓ App Installed Successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default DownloadAppModal;
