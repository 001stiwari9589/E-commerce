import ProductCard from "./ProductCard";

function WishlistView({
  wishlistItems,
  filteredProducts,
  onBackToHome,
  handleAddToCart,
  handleProductSelect,
  handleToggleWishlist,
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-5 md:p-6 transition-colors">
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-850 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
          My Liked Items / Wishlist ({wishlistItems.length})
        </h2>
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
        >
          Back to Store Catalog
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
            Your Wishlist is empty!
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-[280px]">
            Heart your favorite products to bookmark them here.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-5 px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={handleAddToCart}
              onSelect={handleProductSelect}
              isWishlisted={wishlistItems.includes(product.id)}
              toggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistView;
