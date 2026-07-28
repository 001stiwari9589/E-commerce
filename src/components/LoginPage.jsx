import { useState, useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import { apiService } from "../services/api";
import OtpInput from "./OtpInput";

function LoginPage({ onLoginSuccess, onBack }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const [showSmsToast, setShowSmsToast] = useState(false);

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
    setSuccessMsg("");
    setIsSendingOtp(true);
    try {
      const res = await apiService.sendOtp(emailOrPhone);
      if (res && res.success) {
        const isMobile = !emailOrPhone.includes("@");
        const code = res.otp || "";
        setOtp("");
        setReceivedOtp(code);
        setShowSmsToast(true);
        setStep("otp");
        setResendTimer(60);
        setSuccessMsg(
          isMobile
            ? `📱 SMS Verification Code dispatched to ${emailOrPhone}.`
            : `📩 Email Verification Code sent to ${emailOrPhone}.`
        );

        // Native Browser OS Push Notification if permitted
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            try {
              new Notification("💬 ST Mart SMS OTP", {
                body: `Your OTP for ${emailOrPhone} is: ${code}`,
              });
            } catch (nErr) {
              console.warn("Notification error:", nErr);
            }
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((perm) => {
              if (perm === "granted") {
                try {
                  new Notification("💬 ST Mart SMS OTP", {
                    body: `Your OTP for ${emailOrPhone} is: ${code}`,
                  });
                } catch (nErr) {
                  console.warn("Notification error:", nErr);
                }
              }
            });
          }
        }
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
      const res = await apiService.loginWithGoogle(account);
      if (res && res.success) {
        onLoginSuccess(account.email);
      } else {
        onLoginSuccess(account.email);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      onLoginSuccess(account.email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900 dark:bg-black relative overflow-hidden">
      
      {/* Real-time Mobile SMS Push Toast Notification Banner */}
      {showSmsToast && receivedOtp && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-[90%] sm:w-full bg-slate-900 dark:bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 dark:border-amber-500/40 animate-slide-down flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 rounded-lg text-[10px] font-black uppercase">💬 SMS</span>
              <span className="text-xs font-bold text-slate-200">ST-MART-SMS</span>
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
          <div className="text-xs text-slate-300 leading-relaxed">
            Security OTP for <span className="font-bold text-white">{emailOrPhone}</span> is <span className="font-black text-amber-400 text-sm tracking-wider px-1.5 py-0.5 bg-zinc-800 rounded">{receivedOtp}</span>.
          </div>
          <div className="flex justify-end gap-2 mt-1">
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

      {/* Dynamic Ambient Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Main Login Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-200 dark:border-zinc-800 animate-zoom-in">
        
        {/* Left Panel: Branding & Features (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 lg:p-10 flex flex-col justify-between text-white relative">
          
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white mb-6 cursor-pointer group transition-colors"
              >
                <span>&larr;</span> Back to Store
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black italic tracking-wide text-white">
                ST <span className="text-amber-400">Mart</span>
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest">
                Plus✦ Store
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-3">
              Fast, Secure & Seamless Login
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              Access your orders, wishlist, personalized deals, and superfast 1-click checkout with ST Mart Security Auth.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-center lg:text-left">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
              ✦ 100% ST MART SECURITY GUARANTEE
            </span>
          </div>
        </div>

        {/* Right Panel: Login Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-zinc-900">
          
          <div>
            {step === "input" ? (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Sign In to ST Mart
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Enter your Email or Mobile Number to receive a 4-digit verification code.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Email or Mobile Number
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
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-xs transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98"
                >
                  {isSendingOtp ? "Dispatching Security OTP..." : "Get OTP"}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-3 text-slate-400 dark:text-zinc-500 font-bold">Or Continue With</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 font-bold rounded-2xl shadow-xs transition-all cursor-pointer text-sm transform active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Enter 4-Digit Verification OTP
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Sent code to <span className="font-bold text-slate-900 dark:text-white">{emailOrPhone}</span> via {emailOrPhone.includes("@") ? "Email" : "Mobile SMS"}.
                  </p>
                </div>

                {successMsg && (
                  <div className="text-xs font-bold text-blue-700 dark:text-amber-300 bg-blue-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <p>{successMsg}</p>
                      {receivedOtp && (
                        <p className="mt-1 text-slate-700 dark:text-slate-200">
                          Security OTP Code: <span className="font-black text-blue-800 dark:text-amber-400 text-sm bg-blue-100 dark:bg-zinc-800 px-2 py-0.5 rounded tracking-widest">{receivedOtp}</span>
                        </p>
                      )}
                    </div>
                    {receivedOtp && (
                      <button
                        type="button"
                        onClick={() => setOtp(receivedOtp)}
                        className="shrink-0 text-[11px] bg-blue-600 hover:bg-blue-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 px-3 py-1.5 rounded-lg font-black tracking-wide cursor-pointer transition-colors shadow-xs"
                      >
                        Auto-Fill Code
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Enter Security Code
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
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="w-1/3 py-4 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In &rarr;"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed">
              By continuing, you agree to ST Mart's{" "}
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
