import BuyProductButton from "./BuyProductButton";

function ProductCard({
  product,
  addToCart,
  onSelect,
  isWishlisted,
  toggleWishlist,
  cartItems = [],
  handleUpdateQty,
}) {
  if (!product) return null;
  const cartItem = cartItems.find((item) => item && item.id === product.id);
  const cartQuantity = cartItem ? cartItem.qty : 0;

  const merchant = "Amazon";
  const isAmazon = true;
  const isAffiliate = true;

  const price = product.currentPrice || product.price || 0;
  const listedPrice = product.listedPrice || product.originalPrice || 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xs border border-gray-150 dark:border-zinc-800 p-2.5 sm:p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      {/* Product Image & Wishlist Link */}
      <div className="relative bg-slate-50 dark:bg-zinc-850 rounded-xl p-2 sm:p-4 flex items-center justify-center h-36 sm:h-52 w-full overflow-hidden border border-slate-100 dark:border-zinc-800/50">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60";
          }}
          className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
        />

        {/* Amazon Verified Deal Tag */}
        <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md bg-slate-950/95 text-amber-400 border border-amber-400/40 flex items-center gap-1 backdrop-blur-xs">
          <span>🛒</span> Amazon Deal
        </span>

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full shadow backdrop-blur-xs transition-all duration-300 active:scale-75 cursor-pointer ${
            isWishlisted
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500"
              : "bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-rose-500"
          }`}
          title="Save to Wishlist"
        >
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? "fill-current animate-heartbeat" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Discount Badge overlay */}
        {product.discount > 0 && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white font-black text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="flex-1 flex flex-col justify-between mt-2.5 sm:mt-4">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-amber-500 uppercase tracking-widest block truncate">
            {product.brand || product.category}
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white line-clamp-1 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h2>

          {/* Rating & Merchant banner */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
            {product.rating ? (
              <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                {product.rating} ★
              </span>
            ) : null}
            <span className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              {product.merchant || "Amazon"} Deal
            </span>
          </div>

          {/* Pricing detail */}
          <div className="mt-2 sm:mt-2.5">
            {price && Number(price) > 0 ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{Number(price).toLocaleString("en-IN")}
                </span>
                {listedPrice && listedPrice > price && (
                  <span className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 line-through">
                    ₹{Number(listedPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                Check current price on merchant website
              </span>
            )}
          </div>
          
          {/* Trust disclaimer */}
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5 sm:mt-1 truncate flex items-center gap-1">
            <span>🛡️</span> Fulfilled directly by Amazon.in
          </p>
        </div>

        {/* Action Button: Always Direct Amazon Affiliate Link */}
        <div className="mt-2.5 sm:mt-4" onClick={(e) => e.stopPropagation()}>
          <BuyProductButton
            product={{
              ...product,
              merchant: "Amazon",
              isAffiliate: true,
              affiliateUrl: product.affiliateUrl || `https://www.amazon.in/s?k=${encodeURIComponent(product.name || "deals")}&tag=stmart05-21`
            }}
            sourcePage="home_card"
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
