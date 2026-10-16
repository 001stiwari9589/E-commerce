import { safeLocalStorage } from "../utils/localStorage";

export const DEFAULT_PAYMENT_CONFIG = {
  merchantUpiId: "9589018011@ybl",
  merchantName: "ST MART",
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
      // Overwrite legacy dummy fallback or personal name references with ST MART
      if (!parsed.merchantUpiId || parsed.merchantUpiId === "stmart.pay@okaxis" || !parsed.merchantName || parsed.merchantName.toLowerCase().includes("satyam") || parsed.merchantName.toLowerCase().includes("tiwari")) {
        parsed.merchantUpiId = "9589018011@ybl";
        parsed.merchantName = "ST MART";
        savePaymentConfig(parsed);
      }
      return { ...DEFAULT_PAYMENT_CONFIG, ...parsed, merchantName: "ST MART" };
    } catch {
      return DEFAULT_PAYMENT_CONFIG;
    }
  }
  return DEFAULT_PAYMENT_CONFIG;
};

export const savePaymentConfig = (config) => {
  const sanitized = { ...config, merchantName: "ST MART" };
  safeLocalStorage.setItem("stmart_payment_config", JSON.stringify(sanitized));
};

export const generateUpiUrl = ({ upiId, name, amount, orderId }) => {
  const activeConfig = getPaymentConfig();
  const cleanUpi = (upiId || activeConfig.merchantUpiId || DEFAULT_PAYMENT_CONFIG.merchantUpiId).trim();
  const cleanName = "ST MART";
  const cleanNote = `Payment for Order ${orderId || "STM"}`;
  const formattedAmount = Number(amount || 0).toFixed(2);

  // Clean universal NPCI standard UPI URI Scheme
  // We avoid mode=02 / mc flags because for personal/standard VPAs, PhonePe's security filter flags them as unauthorized merchant spoofing
  const encodedUpi = encodeURIComponent(cleanUpi);
  const encodedName = encodeURIComponent(cleanName);
  const encodedNote = encodeURIComponent(`Order ${orderId || "STM"} ST MART`);

  return `upi://pay?pa=${encodedUpi}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}`;
};

export const getUpiQrCodeUrl = ({ upiId, name, amount, orderId, customQrUrl }) => {
  if (customQrUrl && customQrUrl.trim().length > 5) {
    return customQrUrl.trim();
  }
  const rawUpiUrl = generateUpiUrl({ upiId, name: "ST MART", amount, orderId });
  const encodedUpi = encodeURIComponent(rawUpiUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodedUpi}&margin=10`;
};

