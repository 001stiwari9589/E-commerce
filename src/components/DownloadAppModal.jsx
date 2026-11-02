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

    // If already captured globally
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
      }, 2500);
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
      // Trigger official native Android / Chrome installation prompt
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
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      // Browser fallback instructions
      setShowIOSInstructions(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        title="Dismiss popup"
      ></div>

      {/* Main Popup Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-400/80 dark:border-amber-500/60 p-5 sm:p-7 text-slate-900 dark:text-white animate-zoom-in overflow-hidden z-10">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title="Close popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {installSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl font-black mb-3 shadow-lg animate-bounce">
              ✓
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              App Installed Successfully!
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-xs">
              SmartDeals icon has been added to your phone home screen for instant 1-click access.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* App Header & Brand Info */}
            <div className="flex items-center gap-3.5 pr-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                  🛍️
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    SmartDeals<span className="text-amber-500">.in</span>
                  </h3>
                  <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase">
                    Official App
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold truncate mt-0.5">
                  Verified Amazon Deals & Loot Offers
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-600 dark:text-zinc-300">
                  <span className="text-amber-500 font-black flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                  <span>•</span>
                  <span>15K+ Downloads</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">Free (2.4 MB)</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights Banner */}
            <div className="bg-slate-50 dark:bg-zinc-800/80 rounded-2xl p-3 border border-slate-200 dark:border-zinc-750 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200">
                <span className="text-amber-500">⚡</span>
                <span>Instant Flash Sale & 50%+ Loot Deal Alerts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200">
                <span className="text-emerald-500">🚀</span>
                <span>10x Faster 1-Click Access from Phone Home Screen</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200">
                <span className="text-blue-500">🛡️</span>
                <span>100% Genuine Products Fulfilled by Amazon India</span>
              </div>
            </div>

            {/* Step-by-step Guide for iOS or fallback browsers */}
            {showIOSInstructions && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/50 rounded-2xl p-3 text-xs text-slate-800 dark:text-amber-200 flex flex-col gap-1.5 animate-fade-in">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span>📱</span> To install on your phone:
                </span>
                {isIOS ? (
                  <ol className="list-decimal pl-4 space-y-1 font-semibold text-[11px]">
                    <li>Tap the <strong>Share</strong> button <span className="inline-block px-1 bg-white dark:bg-zinc-900 rounded shadow-xs">📤</span> at the bottom of Safari.</li>
                    <li>Scroll down and tap <strong>'Add to Home Screen'</strong> <span className="inline-block px-1 bg-white dark:bg-zinc-900 rounded shadow-xs">➕</span>.</li>
                    <li>Tap <strong>'Add'</strong> in the top right corner.</li>
                  </ol>
                ) : (
                  <ol className="list-decimal pl-4 space-y-1 font-semibold text-[11px]">
                    <li>Tap the <strong>3 dots menu (⋮)</strong> at the top right of your browser.</li>
                    <li>Tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.</li>
                    <li>Confirm <strong>'Install'</strong> to download on phone!</li>
                  </ol>
                )}
              </div>
            )}

            {/* CTA Download & Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-base">📥</span>
                <span>Download & Install App (Free)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Continue in Browser
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DownloadAppModal;
