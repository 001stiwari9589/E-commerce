import { useState } from "react";
import { getPaymentConfig, savePaymentConfig, getUpiQrCodeUrl } from "../config/paymentConfig";

function MerchantPaymentSettingsModal({ isOpen, onClose, triggerToast }) {
  const [config, setConfig] = useState(() => getPaymentConfig());

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!config.merchantUpiId || !config.merchantUpiId.includes("@")) {
      if (triggerToast) triggerToast("Please enter a valid UPI ID (e.g. mobile@paytm or name@okaxis)", "error");
      return;
    }
    savePaymentConfig(config);
    if (triggerToast) triggerToast("Merchant UPI Payment Settings Updated Successfully! 🎉", "success");
    onClose();
  };

  const qrCodeUrl = getUpiQrCodeUrl({
    upiId: config.merchantUpiId,
    name: config.merchantName,
    amount: "499",
    orderId: "TEST1234",
    customQrUrl: config.customQrUrl,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in text-slate-900 dark:text-zinc-100">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Bank Payment Account Settings</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Configure UPI ID &amp; QR Code to receive payment directly in your account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <p className="font-bold flex items-center gap-1.5 text-xs mb-1">
              <span>🔒</span> Direct Bank Credit System
            </p>
            <p className="text-[11px] leading-relaxed">
              When customers scan the QR Code during checkout, money will be directly transferred into this UPI bank account!
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
              Your Primary Bank UPI ID (VPA) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 9876543210@paytm, name@okaxis, user@ybl"
              value={config.merchantUpiId}
              onChange={(e) => setConfig({ ...config, merchantUpiId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
              Check your Paytm, PhonePe, Google Pay, or Banking app for your VPA ID.
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
              Account / Merchant Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ST Mart Store / Rahul Sharma"
              value={config.merchantName}
              onChange={(e) => setConfig({ ...config, merchantName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1">
              Custom QR Code Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/my-scanner-qr.png"
              value={config.customQrUrl || ""}
              onChange={(e) => setConfig({ ...config, customQrUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
              Leave blank to automatically auto-generate dynamic QR code with order amount.
            </p>
          </div>

          {/* Live QR Code Preview */}
          <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Live QR Preview (Test Scan)
            </span>
            <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-md flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="Merchant UPI QR Code"
                className="w-40 h-40 object-contain rounded-lg"
              />
              <span className="text-[11px] font-extrabold text-slate-900 mt-2 font-mono">{config.merchantUpiId}</span>
              <span className="text-[10px] text-slate-500 font-medium">{config.merchantName}</span>
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
      </div>
    </div>
  );
}

export default MerchantPaymentSettingsModal;
