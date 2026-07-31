import { safeLocalStorage } from "../utils/localStorage";

export const DEFAULT_PAYMENT_CONFIG = {
  merchantUpiId: "stmart.pay@okaxis",
  merchantName: "ST Mart Official",
  merchantPhone: "9876543210",
  customQrUrl: "",
};

export const getPaymentConfig = () => {
  const saved = safeLocalStorage.getItem("stmart_payment_config");
  if (saved) {
    try {
      return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(saved) };
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
  const cleanUpi = (upiId || DEFAULT_PAYMENT_CONFIG.merchantUpiId).trim();
  const cleanName = encodeURIComponent((name || DEFAULT_PAYMENT_CONFIG.merchantName).trim());
  const cleanNote = encodeURIComponent(`Payment for Order #${orderId || "STM"}`);
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=${cleanNote}`;
};

export const getUpiQrCodeUrl = ({ upiId, name, amount, orderId, customQrUrl }) => {
  if (customQrUrl && customQrUrl.trim().length > 5) {
    return customQrUrl.trim();
  }
  const upiUrl = generateUpiUrl({ upiId, name, amount, orderId });
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(upiUrl)}`;
};
