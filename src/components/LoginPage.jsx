import { useState, useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import { apiService } from "../services/api";

function LoginPage({ onLoginSuccess, onBack }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'otp'
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    if (!otp.trim()) {
      setError("Please enter the 4-digit OTP.");
      return;
    }
    if (otp !== "1234" && otp !== "0000") {
      setError("Incorrect OTP! Use default test code 1234.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await apiService.login(emailOrPhone, otp);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
      onLoginSuccess(emailOrPhone);
      onBack();
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
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-5 animate-fade-in text-slate-800 dark:text-zinc-150 transition-colors my-10">
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Left branding banner */}
      <div className="hidden md:flex md:col-span-2 bg-blue-600 dark:bg-zinc-850 p-8 flex-col justify-between text-white">
        <div>
          <h2 className="text-2xl font-black">Login / Register</h2>
          <p className="text-xs text-blue-100 dark:text-zinc-400 mt-3 leading-relaxed">
            Get access to your Orders, Wishlist, Recommendations, and secure checkout.
          </p>
        </div>
        <div className="opacity-15 self-center my-6">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <p className="text-[9px] text-blue-200 dark:text-zinc-550 font-bold uppercase tracking-wider">
          ✦ AdrsMart Security Guarantee
        </p>
      </div>

      {/* Right panel inputs */}
      <div className="md:col-span-3 p-8 flex flex-col justify-between relative bg-white dark:bg-zinc-900">

        {/* Back link in login */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>

        <div className="my-auto">
          {step === "input" ? (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to AdrsMart
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Choose a sign in method to proceed.
                </p>
              </div>              {/* Continue with Google Button */}
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

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
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
                    placeholder="Email ID / Mobile Number"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-700 transition-all font-semibold text-sm placeholder-gray-400 dark:placeholder-zinc-650 shadow-xs"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-950/30">
                    {error}
                  </p>
                )}

                <p className="text-[10px] text-slate-400 dark:text-zinc-550 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Terms of Use</span>{" "}
                  and{" "}
                  <span className="text-blue-500 dark:text-amber-500 hover:underline cursor-pointer">Privacy Policies</span>.
                </p>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm"
                >
                  Request Verification OTP
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Enter 4-Digit OTP
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Sent code to <span className="font-bold text-slate-700 dark:text-zinc-300">{emailOrPhone}</span>.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="relative w-full">
                  <input
                    type={showOtp ? "text" : "password"}
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-Digit OTP (Hint: 1234)"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-700 transition-all text-center tracking-widest font-black text-lg placeholder-gray-400 dark:placeholder-zinc-650 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-350 focus:outline-none cursor-pointer p-1"
                    title={showOtp ? "Hide OTP" : "Show OTP"}
                  >
                    {showOtp ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
                    Demo Mode: Use code 1234
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp("1234")}
                    className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
                  >
                    Resend Code
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
            New to AdrsMart?{" "}
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
