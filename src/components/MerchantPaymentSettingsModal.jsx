import { useState, useEffect } from "react";
import { getPaymentConfig, savePaymentConfig, getUpiQrCodeUrl, isValidUpiId } from "../config/paymentConfig";

function MerchantPaymentSettingsModal({ isOpen, onClose, triggerToast }) {
  const [config, setConfig] = useState(() => getPaymentConfig());
  const [activeTab, setActiveTab] = useState("settings"); // "settings" | "guide"

  useEffect(() => {
    if (isOpen) {
      setConfig(getPaymentConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!config.merchantUpiId || !isValidUpiId(config.merchantUpiId)) {
      if (triggerToast) triggerToast("Please enter a valid UPI ID (e.g. stmart@okaxis, 9589018011@ybl, or mobile@paytm)", "error");
      return;
    }
    savePaymentConfig({ ...config, merchantName: "ST MART" });
    if (triggerToast) triggerToast("Merchant UPI Payment Settings Updated Successfully! 🎉", "success");
    onClose();
  };

  const qrCodeUrl = getUpiQrCodeUrl({
    upiId: config.merchantUpiId,
    name: "ST MART",
    amount: "499",
    orderId: "TEST1234",
    customQrUrl: config.customQrUrl,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in text-slate-900 dark:text-zinc-100">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
              💳
            </span>
            <div>
              <h3 className="font-extrabold text-base leading-tight flex items-center gap-2">
                Merchant UPI &amp; Bank Settings
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">ST Mart</span>
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">Configure UPI ID &amp; QR Code to receive payment directly in your account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400"
            }`}
          >
            ⚙️ UPI Configuration
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "guide"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400"
            }`}
          >
            <span>💡</span> Show "ST Mart" in UPI Apps (Guide)
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === "settings" ? (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold no-scrollbar">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <p className="font-bold flex items-center gap-1.5 text-xs mb-1">
                <span>🔒</span> Direct Bank Credit System
              </p>
              <p className="text-[11px] leading-relaxed">
                When customers scan the QR Code during checkout or click PhonePe / GPay, money is directly transferred into your linked UPI account under merchant name <strong>ST MART</strong>!
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
                Primary UPI ID (VPA) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9589018011@ybl, stmart@paytm, or stmart@okbizaxis"
                value={config.merchantUpiId}
                onChange={(e) => setConfig({ ...config, merchantUpiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                Enter your PhonePe, Google Pay, Paytm, or Bank Merchant UPI ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
                Store / Merchant Display Name *
              </label>
              <input
                type="text"
                required
                value="ST MART"
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                ✓ Locked to "ST MART" across all UPI intents, QR codes, and receipts.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
                Custom Merchant QR Code Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/stmart-phonepe-business-qr.png"
                value={config.customQrUrl || ""}
                onChange={(e) => setConfig({ ...config, customQrUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                Optional: Paste direct image link of your PhonePe/GPay Business QR code for ST Mart.
              </p>
            </div>

            {/* Live QR Code Preview */}
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 flex flex-col items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📷</span> Live Generated Dynamic QR Preview
              </span>
              <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-md flex flex-col items-center text-slate-900">
                <img
                  src={qrCodeUrl}
                  alt="Merchant UPI QR Code"
                  className="w-36 h-36 object-contain rounded-lg"
                />
                <span className="text-[11px] font-extrabold text-slate-900 mt-2 font-mono">{config.merchantUpiId}</span>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <span>✓</span> ST MART STORE
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                Save Payment Settings
              </button>
            </div>
          </form>
        ) : (
          /* Guide Tab: How to show ST Mart in UPI Apps */
          <div className="p-6 overflow-y-auto space-y-4 text-xs font-semibold no-scrollbar">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
              <h4 className="font-black text-sm flex items-center gap-2 mb-1.5">
                <span>🔍</span> Why personal names show up in UPI Apps:
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 font-medium">
                In India, the National Payments Corporation of India (<strong>NPCI</strong>) and RBI mandate that for <strong>Personal Savings Accounts (P2P)</strong>, UPI apps (PhonePe, Google Pay, Paytm) must display the account holder's KYC legal name from the receiving bank to prevent fraud. Even if an e-commerce website sends <code className="bg-white/80 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">pn=ST%20MART</code>, bank verification displays the personal name registered with that bank.
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
              <h4 className="font-black text-sm flex items-center gap-2 mb-2">
                <span>🚀</span> 3-Step Permanent Solution to display "ST Mart":
              </h4>
              <ol className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium list-decimal pl-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Download PhonePe Business or Google Pay for Business</strong> (100% Free from Play Store / App Store).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Sign up with Business Name as "ST Mart"</strong> and link your existing bank account.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Copy your Merchant UPI ID</strong> (or Merchant QR) and paste it into the "UPI Configuration" tab here.
                </li>
              </ol>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700">
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1.5">
                ✨ Result for your Customers:
              </h5>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Once a Merchant UPI ID (P2M) is configured, PhonePe, Google Pay, and Paytm verify your business and will display <strong>"ST Mart (Verified Business ✅)"</strong> directly on the payment screen, with zero personal name shown!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md transition-all cursor-pointer text-center"
            >
              &larr; Back to UPI Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MerchantPaymentSettingsModal;
