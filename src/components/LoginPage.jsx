import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import OtpInput from "./OtpInput";
import { notifyLoginWhatsApp } from "../services/whatsappService";

function LoginPage({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp' | 'success'
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtp, setShowOtp] = useState(true);

  // Timers: 60s cooldown for resend, 5 minutes (300s) for OTP expiry
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(300);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Resend cooldown timer (60s -> 0)
  useEffect(() => {
    let timer;
    if (step === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // 5-minute OTP expiry countdown timer (300s -> 0)
  useEffect(() => {
    let timer;
    if (step === "otp" && expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => {
          if (prev <= 1) {
            setError("OTP has expired (5-minute validity). Please click Resend OTP to receive a new code.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const validateEmailFormat = (val) => {
    if (!val) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleBackToInput = () => {
    setStep("input");
    setError("");
    setInfoMessage("");
    setOtp("");
  };

  const handleBackToStore = () => {
    if (onBack) onBack();
  };

  // STEP 1 & 2: Send real OTP to Email
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your Gmail or Email address.");
      return;
    }

    if (!validateEmailFormat(cleanEmail)) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    setError("");
    setInfoMessage("");
    setIsSendingOtp(true);

    try {
      const res = await apiService.sendOtp(cleanEmail);
      if (res && res.success) {
        setStep("otp");
        setOtp("");
        setResendCooldown(60);
        setExpirySeconds(300); // 5 minutes
        setInfoMessage(res.message || `A 6-digit verification code was sent to ${cleanEmail}.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res?.message || "Failed to send verification code. Please check your email configuration.");
      }
    } catch (err) {
      console.error("sendOtp error:", err);
      setError("Unable to connect to verification server. Please check your internet connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend fresh OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    const cleanEmail = email.trim();

    setError("");
    setInfoMessage("");
    setIsSendingOtp(true);

    try {
      const res = await apiService.resendOtp(cleanEmail);
      if (res && res.success) {
        setOtp("");
        setResendCooldown(60);
        setExpirySeconds(300);
        setInfoMessage(res.message || `A fresh 6-digit code has been sent to ${cleanEmail}.`);
      } else {
        setError(res?.message || "Failed to resend code. Please try again.");
      }
    } catch (err) {
      console.error("resendOtp error:", err);
      setError("Network error while requesting new OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // STEP 4: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (expirySeconds <= 0) {
      setError("This OTP has expired. Please click Resend OTP to receive a new code.");
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      const res = await apiService.verifyOtp(email, cleanOtp);
      if (res && res.success) {
        setStep("success");
        notifyLoginWhatsApp(email);

        // Allow user to see the success checkmark for 1 second, then transition
        setTimeout(() => {
          onLoginSuccess(email);
        }, 1100);
      } else {
        setError(res?.message || "Invalid OTP code. Please check your email inbox and try again.");
      }
    } catch (err) {
      console.error("verifyOtp error:", err);
      setError("Verification failed. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900 dark:bg-black relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-200 dark:border-zinc-800 animate-zoom-in">
        
        {/* Left Branding Panel (5 Columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 lg:p-10 flex flex-col justify-between text-white relative">
          <div>
            {onBack && (
              <button
                onClick={handleBackToStore}
                className="flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white mb-6 cursor-pointer group transition-colors"
              >
                <span>&larr;</span> Back to Store
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black italic tracking-wide text-white">
                Smart<span className="text-amber-400">Deals</span><span className="text-sm font-sans font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded ml-1">.IN</span>
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest">
                Official Deals Hub
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-3">
              Real-Time Email Verification
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              We send a real 6-digit verification code directly to your Gmail inbox for 100% safe, verified authentication.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <span className="text-emerald-300 font-black">✓</span> 5-Minute Secure Expiry
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <span className="text-emerald-300 font-black">✓</span> Encrypted Hashed Verification
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <span className="text-emerald-300 font-black">✓</span> Instant One-Click Access
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center lg:text-left mt-6">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
              ✦ 100% SMARTDEALS SECURITY GUARANTEE
            </span>
          </div>
        </div>

        {/* Right Interactive Panel (7 Columns) */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-zinc-900">
          
          <div>
            {/* STEP 1: Enter Email Form */}
            {step === "input" && (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Sign In or Register
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Enter your Gmail address to receive your 6-digit verification OTP.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                      e.g. name@gmail.com
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-xs transition-all"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-fade-in">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Sending OTP to Inbox...</span>
                    </>
                  ) : (
                    <span>Send Verification OTP &rarr;</span>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter 6-Digit OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Enter Verification Code
                    </h3>
                    <button
                      type="button"
                      onClick={handleBackToInput}
                      className="text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    We've dispatched a real 6-digit OTP code to <strong className="text-slate-900 dark:text-white">{email}</strong>.
                  </p>
                </div>

                {infoMessage && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <span>✉️</span>
                    <span>{infoMessage} (Check Inbox & Spam folder)</span>
                  </div>
                )}

                {/* Expiry Countdown Timer Badge */}
                <div className="flex items-center justify-between bg-slate-100 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-750">
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
                    <span>⏱️</span> Code Valid For:
                  </span>
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                    expirySeconds < 60
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-slate-200 dark:bg-zinc-700 text-slate-900 dark:text-white"
                  }`}>
                    {formatTimer(expirySeconds)}
                  </span>
                </div>

                {/* 6-Digit Separate OTP Input Boxes */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      6-Digit Security OTP
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      {showOtp ? "Hide" : "Show"} Code
                    </button>
                  </div>

                  <OtpInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    showOtp={showOtp}
                  />

                  {/* Resend Cooldown Controls */}
                  <div className="flex justify-between items-center px-1 mt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                      Didn't receive email?
                    </span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSendingOtp}
                      onClick={handleResendOtp}
                      className={`text-xs font-black transition-colors cursor-pointer ${
                        resendCooldown > 0 || isSendingOtp
                          ? "text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                          : "text-blue-600 dark:text-amber-400 hover:underline"
                      }`}
                    >
                      {isSendingOtp
                        ? "Sending..."
                        : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Code ↺"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-fade-in">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBackToInput}
                    disabled={isVerifying}
                    className="w-1/3 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || otp.length < 6 || expirySeconds <= 0}
                    className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify & Continue &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Verification Success */}
            {step === "success" && (
              <div className="py-10 flex flex-col items-center justify-center text-center animate-zoom-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl font-black mb-4 shadow-lg animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Email Verified!
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs">
                  Your email has been securely authenticated. Redirecting to your account...
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center mt-6">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed">
              By continuing, you agree to SmartDeals's{" "}
              <span className="text-blue-600 dark:text-amber-400 hover:underline cursor-pointer">Terms of Use</span>{" "}
              and{" "}
              <span className="text-blue-600 dark:text-amber-400 hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
