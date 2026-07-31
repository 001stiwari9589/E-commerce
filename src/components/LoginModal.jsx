import { useState, useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import { apiService } from "../services/api";
import OtpInput from "./OtpInput";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const [showSmsToast, setShowSmsToast] = useState(false);

  // Clean form state on open/close
  useEffect(() => {
    if (!isOpen) {
      setEmailOrPhone("");
      setOtp("");
      setStep("input");
      setError("");
      setIsGoogleModalOpen(false);
      setShowOtp(false);
      setReceivedOtp("");
      setShowSmsToast(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (step === "otp" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

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
      const code = res?.otp || "1234";
      setReceivedOtp(code);
      setOtp("");
      setShowSmsToast(true);
      setStep("otp");
      setResendTimer(60);

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("💬 ST Mart Security OTP", {
            body: `Verification OTP dispatched for ${emailOrPhone}`,
          });
        } catch (nErr) {
          console.warn("Notification notice:", nErr);
        }
      }
    } catch (err) {
      console.warn("sendOtp notice:", err);
      setStep("otp");
      setShowSmsToast(true);
      setResendTimer(60);
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
        onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Real-time Security Notification Toast Banner */}
      {showSmsToast && receivedOtp && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-[90%] sm:w-full bg-slate-900 dark:bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 dark:border-amber-500/40 animate-slide-down flex flex-col gap-2.5 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 rounded-lg text-[10px] font-black uppercase">💬 SMS / Email</span>
              <span className="text-xs font-bold text-slate-200">ST-MART-SECURITY</span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSmsToast(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed flex items-center justify-between gap-2">
            <span>Security OTP Code:</span>
            <span className="font-black text-amber-400 text-sm tracking-wider px-2.5 py-0.5 bg-zinc-800 rounded border border-amber-500/30 font-mono">{receivedOtp}</span>
          </div>
          <div className="flex justify-end gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => {
                setOtp(receivedOtp);
                setShowSmsToast(false);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer transform active:scale-95 flex items-center gap-1"
            >
              ⚡ Auto-Fill OTP ({receivedOtp})
            </button>
          </div>
        </div>
      )}

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 animate-zoom-in text-slate-800 dark:text-zinc-150 border border-gray-200 dark:border-zinc-800">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black italic tracking-wide text-white">
                ST <span className="text-amber-400">Mart</span>
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-widest">
                Plus✦
              </span>
            </div>
            <h3 className="text-xl font-extrabold leading-tight mb-2">
              Login to access Orders & Rewards
            </h3>
            <p className="text-xs text-blue-100 font-medium">
              Get 1-click checkout, instant real-time OTP security, and exclusive deals.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
              ✦ 100% ST MART SECURITY
            </span>
          </div>
        </div>

        {/* Right Side Input */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between relative bg-white dark:bg-zinc-900">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>

          <div>
            {step === "input" ? (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Sign In / Register
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Enter Email or Mobile to receive Security OTP.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      setError("");
                    }}
                    placeholder="name@example.com or 10-digit mobile"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-amber-500"
                  />
                </div>

                {error && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-98"
                >
                  {isSendingOtp ? "Sending Security OTP..." : "Get OTP"}
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-slate-400 dark:text-zinc-500 font-bold">Or</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-3 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 font-bold rounded-xl text-xs transition-all cursor-pointer transform active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Enter Verification OTP
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Enter the 4-digit security code to verify and sign in.
                  </p>
                </div>



                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      4-Digit Verification Code
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
                    length={4}
                    value={otp}
                    onChange={setOtp}
                    showOtp={showOtp}
                  />

                  <div className="flex justify-between items-center px-1 mt-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
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
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="w-1/3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-98"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In &rarr;"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
              Protected by 256-Bit SSL Encryption & ST Mart Security
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginModal;
