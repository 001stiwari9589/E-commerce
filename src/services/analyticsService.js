// Privacy-conscious Outbound Affiliate Click Tracker
// Stores minimal click metrics locally without collecting personal data.
import { safeLocalStorage } from "../utils/localStorage";

const CLICKS_STORAGE_KEY = "st_affiliate_clicks";

export const analyticsService = {
  /**
   * Record a privacy-respecting outbound click on an affiliate product link
   * @param {Object} param
   * @param {number|string} param.productId
   * @param {string} param.productName
   * @param {string} param.merchant - e.g. "Flipkart" | "Amazon"
   * @param {string} param.sourcePage - e.g. "home", "product-detail", "deals"
   */
  trackAffiliateClick({ productId, productName, merchant, sourcePage = "catalog" }) {
    try {
      const clickEvent = {
        id: "clk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        productId,
        productName: productName || "Unnamed Product",
        merchant: merchant || "Partner Merchant",
        sourcePage,
        timestamp: new Date().toISOString(),
      };

      const raw = safeLocalStorage.getItem(CLICKS_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      // Keep up to 100 recent clicks to prevent localStorage overflow
      const updated = [clickEvent, ...existing].slice(0, 100);
      safeLocalStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(updated));

      // Internal note: clicks indicate intent only, not guaranteed sales.
      // Actual commissions are tracked by the merchant (Flipkart/Amazon).
      return clickEvent;
    } catch (err) {
      console.warn("Analytics tracking skipped:", err.message);
      return null;
    }
  },

  /**
   * Get all recorded clicks for local review in Admin Panel
   */
  getClickStats() {
    try {
      const raw = safeLocalStorage.getItem(CLICKS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const totalClicks = list.length;
      const byMerchant = list.reduce((acc, c) => {
        acc[c.merchant] = (acc[c.merchant] || 0) + 1;
        return acc;
      }, {});

      return {
        totalClicks,
        byMerchant,
        recentClicks: list.slice(0, 20),
      };
    } catch {
      return { totalClicks: 0, byMerchant: {}, recentClicks: [] };
    }
  },

  /**
   * Clear local click logs
   */
  clearClickStats() {
    safeLocalStorage.removeItem(CLICKS_STORAGE_KEY);
  },
};
