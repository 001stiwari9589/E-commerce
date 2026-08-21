import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import OtpInput from "./OtpInput";
import { notifyLoginWhatsApp } from "../services/whatsappService";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleBackToInput = () => {
    setStep("input");
    setError("");
    setShowSmsToast(false);
    setReceivedOtp("");
    setOtp("");
    setShowOtp(false);
    if (emailOrPhone) {
      apiService.clearOtp(emailOrPhone);
    }
  };

  if (!isOpen) return null;

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = emailOrPhone.trim();
    if (!cleanInput) {
      setError("Please enter a valid Email or 10-digit Mobile Number");
      return;
    }

    const isEmail = cleanInput.includes("@");
    if (!isEmail) {
      const digits = cleanInput.replace(/\D/g, "");
      if (digits.length < 10) {
        setError("Please enter a valid 10-digit Mobile Number (e.g. 9876543210)");
        return;
      }
    }

    setError("");
    setIsSendingOtp(true);
    try {
      const res = await apiService.sendOtp(emailOrPhone);
      const code = res?.otp || Math.floor(100000 + Math.random() * 900000).toString();
      setReceivedOtp(code);
      setOtp("");
      setShowSmsToast(true);
      setStep("otp");
      setResendTimer(60);

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(isEmail ? "💬 ST Mart Email OTP" : "📱 ST Mart SMS Security OTP", {
            body: `Your 6-digit verification code for ${emailOrPhone} is ${code}`,
          });
        } catch (nErr) {
          console.warn("Notification notice:", nErr);
        }
      }
    } catch (err) {
      console.warn("sendOtp notice:", err);
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setReceivedOtp(fallbackCode);
      setStep("otp");
      setShowSmsToast(true);
      setResendTimer(60);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError("Please enter complete 6-digit OTP code.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const res = await apiService.verifyOtp(emailOrPhone, otp);
      if (res && res.success) {
        await apiService.login(emailOrPhone, otp);
        notifyLoginWhatsApp(emailOrPhone);
        onLoginSuccess(emailOrPhone);
        onClose();
      } else {
        setError(res?.message || "Invalid OTP! Check your Mobile SMS / Email for the correct 6-digit code.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Invalid OTP! Please check your Mobile SMS or Email for the 6-digit code.");
    } finally {
      setIsLoading(false);
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
              <span className="p-1 bg-emerald-600 dark:bg-amber-500 text-white dark:text-slate-950 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                {emailOrPhone.includes("@") ? "💬 EMAIL OTP" : "📱 MOBILE SMS OTP"}
              </span>
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
            <span>6-Digit Security OTP Code:</span>
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
              ⚡ Auto-Fill 6-Digit OTP ({receivedOtp})
            </button>
          </div>
        </div>
      )}



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

              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Enter Verification OTP
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Enter the 6-digit security code to verify and sign in.
                  </p>
                </div>



                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      6-Digit Verification Code
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
                    onClick={handleBackToInput}
                    className="w-1/3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
