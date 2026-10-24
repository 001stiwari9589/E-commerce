import { analyticsService } from "../services/analyticsService";

// Allowed legitimate merchant domains for security and compliance
const ALLOWED_MERCHANT_DOMAINS = [
  "amazon.in",
  "amzn.to",
  "amazon.com",
  "amzn.in",
  "flipkart.com",
  "fkrt.it",
  "affiliate.flipkart.com",
  "dl.flipkart.com",
];

/**
 * Validates whether the given URL is a secure HTTPS link from an allowed merchant domain.
 */
export function isValidAffiliateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith("https://")) return false;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_MERCHANT_DOMAINS.some(
      (allowed) => host === allowed || host.endsWith("." + allowed)
    );
  } catch {
    return false;
  }
}

function BuyProductButton({
  product,
  sourcePage = "catalog",
  className = "",
  size = "md", // "sm" | "md" | "lg"
  label,
}) {
  if (!product) return null;

  const rawUrl = product.affiliateUrl || "";
  const isValid = isValidAffiliateUrl(rawUrl);
  const merchant = product.merchant || (product.brand?.toLowerCase().includes("apple") ? "Flipkart" : "Partner Store");

  const handleClick = (e) => {
    if (!isValid) {
      e.preventDefault();
      return;
    }
    // Track outbound intent without collecting personal data
    analyticsService.trackAffiliateClick({
      productId: product.id,
      productName: product.name,
      merchant,
      sourcePage,
    });
  };

  // Merchant style badge / icon
  const isAmazon = merchant.toLowerCase().includes("amazon");
  const isFlipkart = merchant.toLowerCase().includes("flipkart");

  // Determine sizing
  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs font-bold rounded-lg",
    md: "py-2.5 px-4 text-xs sm:text-sm font-extrabold rounded-xl",
    lg: "py-3.5 px-6 text-sm sm:text-base font-black rounded-xl",
  }[size] || "py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl";

  if (!isValid) {
    return (
      <div className="w-full flex flex-col items-center">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={`w-full bg-slate-150 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/60 cursor-not-allowed flex items-center justify-center gap-1.5 ${sizeClasses} ${className}`}
          title="Direct affiliate buying link will be available once partnership approval is live"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span>Link Coming Soon</span>
        </button>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 text-center">
          Check verified price on {merchant}
        </span>
      </div>
    );
  }

  // Active compliant affiliate link
  const defaultLabel = label || `Buy on ${merchant}`;

  // Theme accents based on partner
  const themeStyle = isAmazon
    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20"
    : isFlipkart
    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20";

  return (
    <a
      href={rawUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      aria-label={`Buy ${product.name} on ${merchant} (opens in a new tab)`}
      className={`inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer text-center ${themeStyle} ${sizeClasses} ${className}`}
    >
      {/* Merchant / External link icon */}
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      <span>{defaultLabel}</span>
    </a>
  );
}

export default BuyProductButton;
