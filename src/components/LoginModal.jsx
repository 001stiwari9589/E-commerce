import { useState, useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import { apiService } from "../services/api";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Clean form state on open/close
  useEffect(() => {
    if (!isOpen) {
      setEmailOrPhone("");
      setOtp("");
      setStep("input");
      setError("");
      setIsGoogleModalOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter a valid Email or Mobile Number");
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      setError("Please enter a valid 4-digit OTP code.");
      return;
    }
    setError("");
    await apiService.login(emailOrPhone, otp);
    onLoginSuccess(emailOrPhone);
    onClose();
  };

  const handleGoogleAccountSelect = async (account) => {
    setIsGoogleModalOpen(false);
    const res = await apiService.loginWithGoogle(account);
    if (res && res.success) {
      onLoginSuccess(account.email);
      onClose();
    } else {
      onLoginSuccess(account.email);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Backdrop Area */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 animate-zoom-in text-slate-800 dark:text-zinc-150 max-h-[90vh]">
        
        {/* Left Side: Blue Branding panel */}
        <div className="hidden md:flex md:col-span-2 bg-blue-600 dark:bg-zinc-800 p-8 flex-col justify-between text-white relative">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Login</h2>
            <p className="text-sm text-blue-100 dark:text-zinc-400 mt-3 leading-relaxed">
              Get access to your Orders, Wishlist and personalized Recommendations.
            </p>
          </div>
          {/* Decorative SVG Graphic representing Shopping Bags */}
          <div className="opacity-20 self-center my-8">
            <svg className="w-32 h-32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <p className="text-[10px] text-blue-200 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            🔒 Secure Store Login
          </p>
        </div>

        {/* Right Side: Inputs and Action */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between relative bg-white dark:bg-zinc-900">
          
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-150 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="my-auto flex flex-col justify-center">
            {step === "input" ? (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Welcome Back!
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                    Choose sign in option to proceed.
                  </p>
                </div>

                {/* Continue with Google Button */}
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-650 text-slate-800 dark:text-white border border-gray-200 dark:border-zinc-700 font-bold rounded-xl shadow-xs transition-colors cursor-pointer transform active:scale-98 text-sm focus:outline-none"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
                </div>

                <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Enter Email/Mobile Number"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-850 transition-all font-medium text-sm placeholder-gray-400 dark:placeholder-zinc-650 shadow-xs"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-950/30">
                      {error}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                    By continuing, you agree to ST Mart's{" "}
                    <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Terms of Use</span>{" "}
                    and{" "}
                    <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Privacy Policy</span>.
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98"
                  >
                    Request OTP
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Enter Verification OTP
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                    Sent OTP to <span className="font-bold text-slate-700 dark:text-zinc-300">{emailOrPhone}</span>.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-Digit OTP (Hint: 1234)"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-850 transition-all text-center tracking-widest font-extrabold text-lg placeholder-gray-400 dark:placeholder-zinc-650 shadow-xs"
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      OTP expires in 2:00 mins
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp("1234")}
                      className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-950/30">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input");
                      setError("");
                    }}
                    className="w-1/3 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold py-3 rounded-xl transition-all cursor-pointer transform active:scale-98"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98"
                  >
                    Verify & Login
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Create Account footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-center">
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              New to FlipMart?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setEmailOrPhone("user@example.com");
                  setStep("input");
                }}
                className="font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginModal;
