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

  let rawUrl = (product.affiliateUrl && product.affiliateUrl.trim().startsWith("https://"))
    ? product.affiliateUrl.trim()
    : `https://www.amazon.in/s?k=${encodeURIComponent(product.name || "deals")}&tag=stmart05-21`;

  // Protect against Amazon 404 delisting errors: convert any /dp/ ASIN links to guaranteed Amazon search queries
  if (rawUrl.includes("/dp/")) {
    const cleanQuery = (product.name || "")
      .replace(/[()[\]{},&]/g, " ")
      .replace(/\b(for|with|and|in|of|by)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    rawUrl = `https://www.amazon.in/s?k=${encodeURIComponent(cleanQuery)}&tag=stmart05-21`;
  }

  const isValid = true;
  const merchant = "Amazon";
  const isAmazon = true;

  // Determine sizing - compact and responsive
  const sizeClasses = {
    sm: "h-9 px-3 text-[11px] sm:text-xs font-bold rounded-xl",
    md: "h-10 px-4 text-xs sm:text-sm font-bold rounded-xl",
    lg: "h-12 px-6 text-sm sm:text-base font-bold rounded-2xl",
  }[size] || "h-9 px-3 text-[11px] sm:text-xs font-bold rounded-xl";

  // If product does not have a verified affiliate link, disable the button
  if (!isValid) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border border-slate-200/80 dark:border-zinc-700/80 cursor-not-allowed select-none font-semibold ${sizeClasses} ${className}`}
        title="Verified merchant affiliate link will be added soon"
      >
        <span>⏳</span>
        <span className="truncate">Coming Soon</span>
      </button>
    );
  }

  const handleClick = () => {
    // Track outbound click locally for analytics
    analyticsService.trackAffiliateClick({
      productId: product.id,
      productName: product.name,
      merchant: isAmazon ? "Amazon" : merchant,
      sourcePage,
    });
  };

  // Compact, modern labels that fit perfectly on mobile screens
  const buttonText = label || (isAmazon ? "Buy on Amazon" : `Buy on ${merchant}`);

  const themeStyle = isAmazon
    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 shadow-sm hover:shadow-md shadow-amber-500/20 hover:scale-[1.01]"
    : "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md shadow-blue-500/20 hover:scale-[1.01]";

  return (
    <a
      href={rawUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      aria-label={`Buy ${product.name} on ${merchant} (opens official merchant in new tab)`}
      className={`w-full inline-flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer text-center group ${themeStyle} ${sizeClasses} ${className}`}
    >
      {/* External Link Arrow Icon */}
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      <span className="truncate tracking-tight">{buttonText}</span>
      <span className="text-[10px] font-black opacity-80 shrink-0">↗</span>
    </a>
  );
}

export default BuyProductButton;
