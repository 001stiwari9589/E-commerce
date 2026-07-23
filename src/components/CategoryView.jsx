import ProductCard from "./ProductCard";

function CategoryView({
  activeCategory,
  onResetCategory,
  filteredProducts,
  handleAddToCart,
  handleProductSelect,
  wishlistItems,
  handleToggleWishlist,
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-5 md:p-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-850 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
          Trending in {activeCategory.toUpperCase()}
        </h2>
        <button
          onClick={onResetCategory}
          className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
        >
          Clear Filters / Back to Deals
        </button>
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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

export default CategoryView;
