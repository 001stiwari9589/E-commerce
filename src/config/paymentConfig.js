import { safeLocalStorage } from "../utils/localStorage";

export const DEFAULT_PAYMENT_CONFIG = {
  merchantUpiId: "9589018011@ybl",
  merchantName: "ST Mart (Union Bank)",
  merchantPhone: "9589018011",
  customQrUrl: "",
};

export const isValidUpiId = (upiId) => {
  if (!upiId || typeof upiId !== "string") return false;
  const clean = upiId.trim();
  // Valid UPI ID format: username@bank / mobile@paytm / name@okaxis
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(clean);
};

export const getPaymentConfig = () => {
  const saved = safeLocalStorage.getItem("stmart_payment_config");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Overwrite legacy dummy fallback with user's real UPI ID
      if (!parsed.merchantUpiId || parsed.merchantUpiId === "stmart.pay@okaxis") {
        parsed.merchantUpiId = "9589018011@ybl";
        parsed.merchantName = "ST Mart (Union Bank)";
        savePaymentConfig(parsed);
      }
      return { ...DEFAULT_PAYMENT_CONFIG, ...parsed };
    } catch {
      return DEFAULT_PAYMENT_CONFIG;
    }
  }
  return DEFAULT_PAYMENT_CONFIG;
};

export const savePaymentConfig = (config) => {
  safeLocalStorage.setItem("stmart_payment_config", JSON.stringify(config));
};

export const generateUpiUrl = ({ upiId, name, amount, orderId }) => {
  const activeConfig = getPaymentConfig();
  const cleanUpi = (upiId || activeConfig.merchantUpiId || DEFAULT_PAYMENT_CONFIG.merchantUpiId).trim();
  const cleanName = (name || activeConfig.merchantName || DEFAULT_PAYMENT_CONFIG.merchantName).trim();
  const cleanNote = `Payment for Order ${orderId || "STM"}`;

  // Standard NPCI UPI URI Scheme
  const params = new URLSearchParams({
    pa: cleanUpi,
    pn: cleanName,
    am: Number(amount || 0).toFixed(2),
    cu: "INR",
    tn: cleanNote,
  });

  return `upi://pay?${params.toString()}`;
};

export const getUpiQrCodeUrl = ({ upiId, name, amount, orderId, customQrUrl }) => {
  if (customQrUrl && customQrUrl.trim().length > 5) {
    return customQrUrl.trim();
  }
  const rawUpiUrl = generateUpiUrl({ upiId, name, amount, orderId });
  const encodedUpi = encodeURIComponent(rawUpiUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodedUpi}&margin=10`;
};

