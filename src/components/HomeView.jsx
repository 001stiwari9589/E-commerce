import { useState, useEffect } from "react";
import HeroCarousel from "./HeroCarousel";
import ProductCard from "./ProductCard";
import { notifyOfferSubscriptionWhatsApp } from "../services/whatsappService";

function HomeView({
  searchQuery,
  onSelectCategory,
  filteredProducts,
  handleAddToCart,
  handleProductSelect,
  wishlistItems,
  handleToggleWishlist,
  triggerToast,
  cartItems = [],
  handleUpdateCartQuantity,
}) {
  // Live Countdown Timer state for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const popularBrands = [
    { name: "All Brands", id: "all" },
    { name: "Apple", id: "Apple" },
    { name: "Samsung", id: "Samsung" },
    { name: "Sony", id: "Sony" },
    { name: "Nike", id: "Nike" },
    { name: "Bose", id: "Bose" },
    { name: "Dyson", id: "Dyson" },
    { name: "ASUS", id: "ASUS" },
    { name: "LEGO", id: "LEGO" },
  ];

  // Apply brand filtering
  let displayedProducts = filteredProducts.filter((p) => {
    if (selectedBrand === "all") return true;
    return (p.brand || "").toLowerCase() === selectedBrand.toLowerCase();
  });

  // Apply sorting
  if (sortOption === "low-to-high") {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "high-to-low") {
    displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === "rating") {
    displayedProducts = [...displayedProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortOption === "discount") {
    displayedProducts = [...displayedProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Flash deals selection (top discounted items)
  const flashDeals = [...filteredProducts]
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberEmail.includes("@")) {
      if (triggerToast) triggerToast("Please enter a valid email address.", "warning");
      return;
    }
    setIsSubscribed(true);
    notifyOfferSubscriptionWhatsApp(subscriberEmail, "STMART500");
    if (triggerToast) {
      triggerToast("🎉 Welcome to ST Mart VIP Club! Your ₹500 Coupon Code: STMART500 sent to WhatsApp!", "success");
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Banner Hero Carousel */}
      {searchQuery === "" && (
        <HeroCarousel onSelectCategory={onSelectCategory} />
      )}

      {/* Trust & Express Delivery Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            icon: "⚡",
            title: "2-Hour Express Delivery",
            sub: "Free shipping on orders over ₹499",
            color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
          },
          {
            icon: "🛡️",
            title: "100% Genuine Products",
            sub: "Directly sourced brand warranty",
            color: "from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
          },
          {
            icon: "🔄",
            title: "7-Day Easy Returns",
            sub: "Instant refunds & exchange policy",
            color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
          },
          {
            icon: "💳",
            title: "Secure 256-Bit Encrypted",
            sub: "UPI, Cards, NetBanking & COD",
            color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border backdrop-blur-xs flex items-center gap-3 transition-transform hover:-translate-y-0.5 shadow-xs`}
          >
            <span className="text-2xl sm:text-3xl shrink-0">{item.icon}</span>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Flash Deals with Ticking Timer */}
      {searchQuery === "" && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 dark:from-rose-950 dark:via-zinc-900 dark:to-zinc-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-rose-400/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🔥</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Flash Sale Deals of the Day
                </h3>
                <p className="text-xs text-rose-100 dark:text-zinc-300 font-semibold">
                  Up to 50% OFF on flagship tech, fashion & appliances
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-200">Ends In:</span>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-yellow-300">
                <span className="bg-white/20 px-2 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                :
                <span className="bg-white/20 px-2 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                :
                <span className="bg-white/20 px-2 py-1 rounded-lg">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deal Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {flashDeals.map((product) => (
              <div
                key={`flash-${product.id}`}
                onClick={() => handleProductSelect(product)}
                className="bg-white dark:bg-zinc-850 rounded-2xl p-3.5 text-slate-900 dark:text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between group border border-rose-100 dark:border-zinc-700"
              >
                <div>
                  <div className="relative bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 h-36 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                      -{product.discount}% OFF
                    </span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-2 text-slate-900 dark:text-white">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-750 flex flex-col gap-1.5">
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full w-[78%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                    <span>⚡ Limited Stock</span>
                    <span className="text-rose-600 dark:text-rose-400">78% Claimed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Deals & Products Catalog */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-xs p-5 sm:p-7 transition-colors flex flex-col gap-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-850 pb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore All Products Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-0.5">
              Showing {displayedProducts.length} premium products available for instant order
            </p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-700">
              <span className="text-slate-500 dark:text-zinc-400">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-extrabold outline-none cursor-pointer"
              >
                <option value="featured" className="dark:bg-zinc-800">Featured</option>
                <option value="low-to-high" className="dark:bg-zinc-800">Price: Low to High</option>
                <option value="high-to-low" className="dark:bg-zinc-800">Price: High to Low</option>
                <option value="rating" className="dark:bg-zinc-800">Highest Rated</option>
                <option value="discount" className="dark:bg-zinc-800">Biggest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 shrink-0 mr-1">Brands:</span>
          {popularBrands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedBrand === b.id
                  ? "bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-105"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Products List Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((product) => (
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
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-3">🔍</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No products found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
              Try adjusting your search keywords or clearing brand filters.
            </p>
            <button
              onClick={() => {
                setSelectedBrand("all");
                setSortOption("featured");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Verified Customer Reviews Section */}
      <div className="bg-slate-900 dark:bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            Real Customer Testimonials
          </span>
          <h3 className="text-2xl font-black mt-1 text-white">
            Loved by 100,000+ Happy Shoppers Across India
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Vikram Mehta",
              location: "New Delhi",
              review: "Ordered the iPhone 15 Pro and got it delivered within 2 hours! The 256-bit encrypted checkout with pincode area finder was super fast.",
              rating: 5,
              product: "Apple iPhone 15 Pro",
            },
            {
              name: "Priya Sharma",
              location: "Bengaluru",
              review: "Amazing shopping experience! Got genuine warranty for my Sony XM5 headphones. Free express shipping and responsive customer support.",
              rating: 5,
              product: "Sony WH-1000XM5",
            },
            {
              name: "Amitabh Roy",
              location: "Kolkata",
              review: "Loved the easy PIN code location auto-fill feature. Payment receipt invoice generated instantly after my UPI payment.",
              rating: 5,
              product: "Samsung Galaxy S24 Ultra",
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/80 p-5 rounded-2xl border border-zinc-700/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                  {"★".repeat(rev.rating)}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  "{rev.review}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-700/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{rev.name}</h4>
                  <p className="text-[10px] text-zinc-400">{rev.location} • Verified Buyer</p>
                </div>
                <span className="text-[10px] bg-zinc-700 px-2 py-0.5 rounded text-amber-300 font-semibold">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter & VIP Club Signup */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="max-w-md">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
            ST Mart VIP Club
          </span>
          <h3 className="text-2xl font-black mt-2 text-white">
            Get ₹500 Off Your Next Order!
          </h3>
          <p className="text-xs text-blue-100 dark:text-zinc-300 font-semibold mt-1">
            Subscribe to our newsletter for exclusive flash sale alerts, coupons, and weekly tech deals.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {isSubscribed ? (
            <div className="bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
              <span>🎉</span> Coupon Code STMART500 Active! (₹500 Discount Saved)
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none w-full sm:w-72 shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg shrink-0 transform active:scale-95"
              >
                Claim ₹500 Coupon
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomeView;
