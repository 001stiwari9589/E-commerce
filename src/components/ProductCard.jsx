function ProductCard({
  product,
  addToCart,
  onSelect,
  isWishlisted,
  toggleWishlist,
}) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      {/* Product Image & Wishlist Link */}
      <div className="relative bg-slate-50 dark:bg-zinc-850 rounded-xl p-4 flex items-center justify-center h-48 sm:h-52 w-full overflow-hidden border border-slate-100 dark:border-zinc-800/50">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow backdrop-blur-xs transition-all duration-300 active:scale-75 cursor-pointer ${
            isWishlisted
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500"
              : "bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-rose-500"
          }`}
        >
          <svg
            className={`w-5 h-5 ${isWishlisted ? "fill-current animate-heartbeat" : ""}`}
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
          <span className="absolute bottom-2.5 left-2.5 bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="flex-1 flex flex-col justify-between mt-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-amber-500 uppercase tracking-widest">
            {product.brand || "ST Mart Choice"}
          </span>
          <h2 className="text-sm font-bold text-slate-850 dark:text-white line-clamp-1 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h2>

          {/* Rating banner */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-sm">
              {product.rating} ★
            </span>
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500">
              ({product.reviewsCount || "432"})
            </span>
          </div>

          {/* Pricing detail */}
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          
          {/* Delivery tags */}
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold mt-1">
            Free Delivery
          </p>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-bold text-xs w-full mt-4 py-2.5 rounded-xl transition-all cursor-pointer transform active:scale-98 flex items-center justify-center gap-1.5 border border-transparent dark:border-zinc-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
