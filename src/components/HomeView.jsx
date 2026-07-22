import HeroCarousel from "./HeroCarousel";
import ProductCard from "./ProductCard";

function HomeView({
  searchQuery,
  onSelectCategory,
  filteredProducts,
  handleAddToCart,
  handleProductSelect,
  wishlistItems,
  handleToggleWishlist,
  triggerToast,
}) {
  return (
    <>
      {/* Banner Hero Carousel */}
      {searchQuery === "" && (
        <HeroCarousel onSelectCategory={onSelectCategory} />
      )}

      {/* Deals Showcase */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-5 md:p-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-850 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              Deals of the Day
            </h2>
          </div>
          <button
            onClick={() => triggerToast("Exploring top premium listings and brands...", "info")}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer transform active:scale-95"
          >
            View All Deals
          </button>
        </div>

        {/* Products List Grid */}
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
      </div>
    </>
  );
}

export default HomeView;
