import { useState, useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import { apiService } from "../services/api";
import OtpInput from "./OtpInput";

function LoginPage({ onLoginSuccess, onBack }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let timer;
    if (step === "otp" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter a valid Email or Mobile Number");
      return;
    }

    setError("");
    setIsSendingOtp(true);
    try {
      const res = await apiService.sendOtp(emailOrPhone);
      if (res && res.success) {
        setSentOtp(res.otp || "");
        setOtp("");
        setStep("otp");
        setResendTimer(60);
      } else {
        setError(res?.message || "Failed to send OTP. Please check email/number.");
      }
    } catch (err) {
      console.error("sendOtp error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      setError("Please enter complete 4-digit OTP code.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const res = await apiService.verifyOtp(emailOrPhone, otp);
      if (res && res.success) {
        await apiService.login(emailOrPhone, otp);
        onLoginSuccess(emailOrPhone);
      } else {
        setError(res?.message || "Invalid OTP! Check your Email Inbox / SMS for the correct code.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Invalid OTP! Please check your Email Inbox or SMS for the 4-digit code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAccountSelect = async (account) => {
    setIsGoogleModalOpen(false);
    setIsLoading(true);
    try {
      await apiService.loginWithGoogle(account);
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setIsLoading(false);
      onLoginSuccess(account.email);
      onBack();
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 animate-fade-in text-slate-800 dark:text-zinc-150 transition-colors my-4 sm:my-8">
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Mobile Top Branding Banner (Visible on mobile/tablet screens < md) */}
      <div className="flex md:hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-zinc-850 dark:to-zinc-900 p-6 flex-col gap-2 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-wide">
              ST <span className="text-yellow-400">Mart</span>
            </span>
            <span className="bg-yellow-400 text-blue-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              ✦ Secure
            </span>
          </div>
          <span className="text-[10px] font-bold text-blue-100 dark:text-zinc-400 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
            Quick Sign In
          </span>
        </div>
        <p className="text-xs text-blue-100 dark:text-zinc-400 z-10 font-medium">
          Get access to Orders, Wishlist & Instant Checkout
        </p>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
      </div>

      {/* Left branding banner (Desktop >= md) */}
      <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-zinc-850 dark:to-zinc-900 p-8 md:p-10 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <span className="text-2xl font-black italic tracking-wide block mb-4">
            ST <span className="text-yellow-400">Mart</span>
          </span>
          <h2 className="text-2xl font-black leading-tight">Login / Register</h2>
          <p className="text-xs text-blue-100 dark:text-zinc-400 mt-3 leading-relaxed">
            Get access to your Orders, Wishlist, Recommendations, and secure checkout.
          </p>
        </div>
        <div className="opacity-15 self-center my-6 z-10">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <p className="text-[10px] text-blue-200 dark:text-zinc-450 font-bold uppercase tracking-wider z-10 flex items-center gap-1">
          <span className="text-yellow-400">✦</span> 100% ST Mart Security Guarantee
        </p>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Right panel inputs */}
      <div className="md:col-span-3 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative bg-white dark:bg-zinc-900">

        {/* Dedicated mandatory login container */}

        <div className="my-auto">
          {step === "input" ? (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to ST Mart
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Choose a sign in method to proceed.
                </p>
              </div>              {/* Email / Mobile OTP Form (First) */}
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email ID / Mobile Number"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-700 transition-all font-semibold text-sm placeholder-gray-400 dark:placeholder-zinc-650 shadow-xs"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-950/30">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm"
                >
                  Request Verification OTP
                </button>
              </form>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
              </div>

              {/* Continue with Google Button (Below) */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-650 text-slate-800 dark:text-white border border-gray-200 dark:border-zinc-700 font-bold rounded-xl shadow-xs transition-colors cursor-pointer transform active:scale-98 text-sm focus:outline-none"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <p className="text-[10px] text-slate-400 dark:text-zinc-550 leading-relaxed text-center">
                By signing in, you agree to our{" "}
                <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Terms of Use</span>{" "}
                and{" "}
                <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Privacy Policies</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Enter 4-Digit Verification OTP
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Sent OTP code to <span className="font-bold text-slate-800 dark:text-zinc-200">{emailOrPhone}</span>
                </p>
              </div>

              {/* Real Mobile SMS or Email Dispatch Notice */}
              {!emailOrPhone.includes("@") ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-extrabold text-xs text-amber-900 dark:text-amber-300">
                        SMS Alert Sent to +91 {emailOrPhone}
                      </p>
                      <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-400 mt-0.5">
                        Your Mobile SMS OTP: <strong className="font-mono text-sm underline tracking-wider">{sentOtp}</strong>
                      </p>
                    </div>
                  </div>
                  {sentOtp && (
                    <button
                      type="button"
                      onClick={() => setOtp(sentOtp)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                    >
                      Auto-Fill SMS
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📩</span>
                    <div>
                      <p className="font-extrabold text-xs text-blue-900 dark:text-blue-300">
                        Security OTP Dispatched to {emailOrPhone}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mt-0.5">
                        Please check your Email Inbox for your 4-digit code.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-0.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                    4-Digit Verification Code
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    {showOtp ? "Hide" : "Show"} Code
                  </button>
                </div>

                <OtpInput
                  length={4}
                  value={otp}
                  onChange={setOtp}
                  showOtp={showOtp}
                />

                <div className="flex justify-between items-center px-1 mt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                    Didn't receive code?
                  </span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || isSendingOtp}
                    onClick={handleRequestOtp}
                    className={`text-xs font-bold transition-colors cursor-pointer ${
                      resendTimer > 0 || isSendingOtp
                        ? "text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                        : "text-blue-600 dark:text-amber-400 hover:underline"
                    }`}
                  >
                    {isSendingOtp
                      ? "Sending OTP..."
                      : resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP (पुनः OTP भेजें)"}
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
                  className="w-1/3 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-slate-650 dark:text-zinc-300 font-bold py-3.5 rounded-xl transition-all cursor-pointer transform active:scale-98 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-center">
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            New to ST Mart?{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setEmailOrPhone("customer@example.com");
                setStep("input");
              }}
              className="font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
            >
              Create dynamic account
            </button>
          </span>
        </div>

      </div>

    </div>
  );
}

export default LoginPage;
