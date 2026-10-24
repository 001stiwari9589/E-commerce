import { useState, useMemo } from "react";
import BuyProductButton from "./BuyProductButton";
import AffiliateDisclosureBanner from "./AffiliateDisclosureBanner";

function DealsRecommendationsPage({
  products = [],
  onSelectProduct,
  setView,
}) {
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Filter curated deals / recommendations
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p && (p.isAffiliate || p.isFeatured || (p.discount && p.discount > 0)));

    if (selectedMerchant !== "all") {
      result = result.filter(
        (p) => (p.merchant || "").toLowerCase() === selectedMerchant.toLowerCase()
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.currentPrice || a.price || 0) - (b.currentPrice || b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.currentPrice || b.price || 0) - (a.currentPrice || a.price || 0));
    } else if (sortBy === "discount") {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedMerchant, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            🔥 Curated Daily Picks
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            Deals & Editor Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Handpicked, verified products from Flipkart and Amazon India with direct buying links.
          </p>
        </div>

        {/* Filter / Sort Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Merchant Filter */}
          <select
            value={selectedMerchant}
            onChange={(e) => setSelectedMerchant(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Stores</option>
            <option value="Flipkart">Flipkart Deals</option>
            <option value="Amazon">Amazon Deals</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="mobile accessories">Mobile Accessories</option>
            <option value="computer accessories">Computer Accessories</option>
            <option value="home and kitchen">Home & Kitchen</option>
            <option value="student essentials">Student Essentials</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="featured">Featured / Best Picks</option>
            <option value="discount">Highest Discount</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Affiliate Transparency Banner */}
      <AffiliateDisclosureBanner setView={setView} />

      {/* Grid of Deals */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800">
          <p className="text-slate-500 dark:text-zinc-400 font-semibold text-sm">
            No deals currently match your selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedMerchant("all");
              setSelectedCategory("all");
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const price = product.currentPrice || product.price || 0;
            const listedPrice = product.listedPrice || product.originalPrice || 0;
            const merchant = product.merchant || "Flipkart";
            const isAmazon = merchant.toLowerCase().includes("amazon");

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Image & Badges */}
                  <div
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className="relative bg-slate-50 dark:bg-zinc-850 rounded-xl p-4 h-48 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60";
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Merchant Tag */}
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
                        isAmazon
                          ? "bg-slate-900 text-amber-400"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {merchant} Verified
                    </span>

                    {/* Discount Tag */}
                    {product.discount > 0 && (
                      <span className="absolute bottom-2 right-2 bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Title & Brand */}
                  <div className="mt-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                      {product.brand || product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct && onSelectProduct(product)}
                      className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-2 mt-0.5 hover:text-blue-600 dark:hover:text-amber-400 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{Number(price).toLocaleString("en-IN")}
                    </span>
                    {listedPrice > price && (
                      <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                        ₹{Number(listedPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Availability notice */}
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                    {product.availabilityCheckedAt
                      ? `Verified: ${product.availabilityCheckedAt}`
                      : "Check merchant page for live stock"}
                  </p>
                </div>

                {/* Direct Affiliate Buy Button */}
                <div className="mt-4 pt-3 border-t border-slate-150 dark:border-zinc-800">
                  <BuyProductButton
                    product={product}
                    sourcePage="deals"
                    size="md"
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DealsRecommendationsPage;
