import { useState, useRef } from "react";
import ProductCard from "./ProductCard";

function CategoryView({
  activeCategory,
  onResetCategory,
  filteredProducts,
  handleAddToCart,
  handleProductSelect,
  wishlistItems,
  handleToggleWishlist,
  cartItems = [],
  handleUpdateCartQuantity,
}) {
  const [viewMode, setViewMode] = useState("carousel"); // 'carousel' | 'grid'
  const productCarouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (productCarouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      productCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-4 sm:p-6 transition-colors">
      {/* Category Header with Layout Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-850 pb-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
            <span>🏷️</span> Trending in {activeCategory}
            <span className="text-xs bg-blue-100 dark:bg-amber-500/20 text-blue-700 dark:text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} Items
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
            Explore curated best-sellers and budget deals in {activeCategory}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Carousel View Mode Switch */}
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold">
            <button
              onClick={() => setViewMode("carousel")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === "carousel"
                  ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-amber-400 shadow-xs font-extrabold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <span>🎠 Carousel</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-amber-400 shadow-xs font-extrabold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <span>🔲 Grid</span>
            </button>
          </div>

          <button
            onClick={onResetCategory}
            className="text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Clear Filters / Back to Deals
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
            No products found
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            We couldn't find any matches. Reset the catalog selection.
          </p>
          <button
            onClick={onResetCategory}
            className="mt-5 px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Reset Catalog
          </button>
        </div>
      ) : viewMode === "carousel" ? (
        /* CAROUSEL SLIDER VIEW */
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 text-slate-800 dark:text-white border border-gray-200 dark:border-zinc-700 shadow-xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-zinc-700 hover:scale-110 cursor-pointer transition-all active:scale-95"
            title="Previous Products"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Sliding Track */}
          <div
            ref={productCarouselRef}
            className="overflow-x-auto no-scrollbar scroll-smooth flex items-stretch gap-4 py-2 px-1"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="w-[230px] sm:w-[260px] md:w-[280px] shrink-0">
                <ProductCard
                  product={product}
                  addToCart={handleAddToCart}
                  onSelect={handleProductSelect}
                  isWishlisted={wishlistItems.includes(product.id)}
                  toggleWishlist={handleToggleWishlist}
                  cartItems={cartItems}
                  handleUpdateQty={handleUpdateCartQuantity}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 text-slate-800 dark:text-white border border-gray-200 dark:border-zinc-700 shadow-xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-zinc-700 hover:scale-110 cursor-pointer transition-all active:scale-95"
            title="Next Products"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={handleAddToCart}
              onSelect={handleProductSelect}
              isWishlisted={wishlistItems.includes(product.id)}
              toggleWishlist={handleToggleWishlist}
              cartItems={cartItems}
              handleUpdateQty={handleUpdateCartQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryView;
