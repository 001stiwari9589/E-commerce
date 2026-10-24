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

  const rawUrl = product.affiliateUrl || "";
  const isValid = isValidAffiliateUrl(rawUrl);
  const merchant = product.merchant || "Amazon";
  const isAmazon = merchant.toLowerCase().includes("amazon") || !product.merchant || product.merchant === "ST Mart";

  // If no direct ASIN URL, automatically fallback to a genuine Amazon search with Satyam's affiliate tag
  const effectiveUrl = isValid
    ? rawUrl
    : `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}&tag=stmart05-21`;

  const handleClick = () => {
    // Track outbound click locally for analytics
    analyticsService.trackAffiliateClick({
      productId: product.id,
      productName: product.name,
      merchant: isAmazon ? "Amazon" : merchant,
      sourcePage,
    });
  };

  // Determine sizing
  const sizeClasses = {
    sm: "py-2 px-3.5 text-xs font-black rounded-xl",
    md: "py-2.5 px-4 text-xs sm:text-sm font-black rounded-xl",
    lg: "py-3.5 px-6 text-sm sm:text-base font-black rounded-2xl",
  }[size] || "py-2.5 px-4 text-xs sm:text-sm font-black rounded-xl";

  const defaultLabel = label || (isAmazon ? "Buy on Amazon (Verified Offer)" : `Buy on ${merchant}`);

  const themeStyle = isAmazon
    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 shadow-md shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40";

  return (
    <a
      href={effectiveUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      aria-label={`Buy ${product.name} on ${isAmazon ? "Amazon" : merchant} (opens in a new tab)`}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer text-center group border border-amber-400/30 ${themeStyle} ${sizeClasses} ${className}`}
    >
      {/* Icon */}
      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      <span className="tracking-tight">{defaultLabel}</span>
      <span className="text-[10px] bg-black/15 text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ml-1">
        Official ↗
      </span>
    </a>
  );
}

export default BuyProductButton;
