import { useState, useEffect } from "react";
import HeroCarousel from "./HeroCarousel";
import ProductCard from "./ProductCard";
import AffiliateDisclosureBanner from "./AffiliateDisclosureBanner";
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
  setView,
}) {
  // Live Countdown Timer state for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [waDirectUrl, setWaDirectUrl] = useState("");
  const [dismissAmazonBanner, setDismissAmazonBanner] = useState(false);

  // Reset banner dismissal on new search query
  useEffect(() => {
    setDismissAmazonBanner(false);
  }, [searchQuery]);

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
    { name: "boAt", id: "boAt" },
    { name: "Portronics", id: "Portronics" },
    { name: "SYSKA", id: "SYSKA" },
    { name: "SanDisk", id: "SanDisk" },
    { name: "Boldfit", id: "Boldfit" },
    { name: "Fastrack", id: "Fastrack" },
    { name: "Pigeon", id: "Pigeon" },
    { name: "Apple", id: "Apple" },
    { name: "Samsung", id: "Samsung" },
    { name: "OnePlus", id: "OnePlus" },
  ];

  // Apply brand & budget filtering
  let displayedProducts = filteredProducts.filter((p) => {
    // When actively searching by query, bypass brand/budget restrictions so all search results appear
    if (searchQuery && searchQuery.trim()) {
      return true;
    }
    if (selectedBrand !== "all" && (p.brand || "").toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    const price = Number(p.price || 0);
    if (budgetFilter === "299" && price > 299) return false;
    if (budgetFilter === "499" && price > 499) return false;
    if (budgetFilter === "999" && price > 999) return false;
    if (budgetFilter === "discount50" && Number(p.discount || 0) < 50) return false;
    return true;
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

  const handleSubscriberInputChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "");
    const hasLetters = /[a-zA-Z@]/.test(raw);

    // If typing digits/phone number, strictly limit to 10 digits
    if (!hasLetters) {
      setSubscriberEmail(digitsOnly.slice(0, 10));
    } else {
      setSubscriberEmail(raw.slice(0, 60));
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanInput = (subscriberEmail || "").trim();
    if (!cleanInput) {
      if (triggerToast) triggerToast("Kripya apna 10-digit mobile number ya email enter karein.", "warning");
      return;
    }

    const isEmail = cleanInput.includes("@");
    const digits = cleanInput.replace(/\D/g, "");

    if (!isEmail) {
      if (digits.length !== 10) {
        if (triggerToast) triggerToast("Mobile number poora 10 digits ka hona chahiye.", "warning");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(digits)) {
        if (triggerToast) triggerToast("Kripya valid 10-digit mobile number enter karein (6, 7, 8, ya 9 se shuru).", "warning");
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanInput)) {
        if (triggerToast) triggerToast("Kripya valid email address enter karein (jaise name@gmail.com).", "warning");
        return;
      }
    }

    setIsSubscribed(true);
    const directUrl = notifyOfferSubscriptionWhatsApp(cleanInput, true);
    setWaDirectUrl(directUrl || "");
    setShowClaimModal(true);

    if (directUrl) {
      try {
        window.open(directUrl, "_blank");
      } catch {
        window.location.href = directUrl;
      }
    }

    if (triggerToast) {
      triggerToast("🔥 Subscribed! You will receive daily Amazon & Flipkart loot deal alerts.", "success");
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
            sub: "UPI, Cards & NetBanking",
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
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 line-through">
                        ₹{Number(product.originalPrice || 0).toLocaleString("en-IN")}
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

      {/* Affiliate Transparency Disclosure */}
      <AffiliateDisclosureBanner setView={setView} />

      {/* Main Deals & Products Catalog */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-xs p-5 sm:p-7 transition-colors flex flex-col gap-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-850 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>🔥</span> Verified Amazon Deals &amp; Loot Store
              </h2>
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                ✓ 100% Genuine Amazon Products
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-0.5">
              Showing {displayedProducts.length} verified deals • Fast Prime delivery &amp; 100% safe checkout directly on Amazon.in
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

        {/* Quick Budget Deals Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-black text-rose-600 dark:text-rose-400 shrink-0 mr-1 flex items-center gap-1">
            <span>⚡</span> Budget Store:
          </span>
          {[
            { id: "all", label: "All Items" },
            { id: "299", label: "🔥 Under ₹299 (Super Budget)" },
            { id: "499", label: "⚡ Under ₹499 (Loot Deals)" },
            { id: "999", label: "✨ Under ₹999" },
            { id: "discount50", label: "💥 50%+ OFF" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setBudgetFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
                budgetFilter === item.id
                  ? "bg-rose-600 text-white border-rose-600 shadow-md scale-105"
                  : "bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/50"
              }`}
            >
              {item.label}
            </button>
          ))}
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

        {/* Live Outbound Search Banner when user searches */}
        {searchQuery && !dismissAmazonBanner && displayedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-900 dark:text-zinc-150">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔍</span>
              <div>
                <p className="text-xs font-black">
                  Want more variations for "{searchQuery}"?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                  Search millions of live items on Amazon with instant discount deals.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}&tag=stmart05-21`}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                Search "{searchQuery}" on Amazon ↗
              </a>
              <button
                type="button"
                onClick={() => setDismissAmazonBanner(true)}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer text-xs font-black"
                title="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-lg mx-auto bg-slate-50 dark:bg-zinc-850/60 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
            <span className="text-5xl mb-3">🔍</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {searchQuery ? `No local results for "${searchQuery}"` : "No products found"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              {searchQuery
                ? `Don't worry! You can find "${searchQuery}" directly on Amazon India with fast delivery & verified pricing.`
                : "Try adjusting your search keywords or clearing active filters."}
            </p>

            {searchQuery ? (
              <a
                href={`https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}&tag=stmart05-21`}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-5 px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-transform transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>🚀 Search "{searchQuery}" on Amazon (Best Deals) ↗</span>
              </a>
            ) : null}

            <button
              onClick={() => {
                setSelectedBrand("all");
                setSortOption("featured");
              }}
              className="mt-4 px-4 py-2 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-800 dark:text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Honest Shopping Guide Section (Replaces fabricated reviews) */}
      <div className="bg-slate-900 dark:bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 border border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            Transparent Affiliate Shopping
          </span>
          <h3 className="text-2xl font-black mt-1 text-white">
            How Shopping on SmartDeals Works
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            We help you discover verified electronics, accessories, and study essentials with direct links to official partner merchants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔍",
              title: "1. Curated Deals & Products",
              desc: "Browse our hand-picked collection of high-rated electronics, earphones, computer accessories, and student gear without sponsored clutter.",
            },
            {
              icon: "🏷️",
              title: "2. Zero Extra Cost To You",
              desc: "You pay the exact same price as directly on Amazon or Flipkart. Qualifying purchases support our independent platform via affiliate commission.",
            },
            {
              icon: "📦",
              title: "3. Official Merchant Fulfillment",
              desc: "Orders, secure online payments, fast courier shipping, manufacturer warranty, and customer returns are 100% fulfilled by the merchant.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-850 p-6 rounded-2xl border border-zinc-750 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h4 className="text-sm font-extrabold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-700/60 text-[11px] text-amber-400 font-bold">
                ✓ 100% Genuine Partner Links
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Deals & Loot Alerts Club */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="max-w-md">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
            🔥 Daily Loot &amp; Price Drop Alerts
          </span>
          <h3 className="text-2xl font-black mt-2 text-white">
            Never Miss a Mega Price Drop!
          </h3>
          <p className="text-xs text-blue-100 dark:text-zinc-300 font-semibold mt-1">
            Subscribe to get instant alerts for 50%+ discounts, lightning deals, and tech price drops from Amazon &amp; Flipkart before they sell out.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {isSubscribed ? (
            <div className="bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
              <span>✅</span> Subscribed! You will receive daily Amazon &amp; Flipkart loot alerts.
            </div>
          ) : (
            <>
              <input
                type="text"
                required
                maxLength={/[a-zA-Z@]/.test(subscriberEmail) ? 60 : 10}
                placeholder="Enter 10-digit mobile or email"
                value={subscriberEmail}
                onChange={handleSubscriberInputChange}
                className="px-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none w-full sm:w-72 shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg shrink-0 transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Get Loot Alerts</span>
                <span>⚡</span>
              </button>
            </>
          )}
        </form>
      </div>

      {/* Deal Alerts Subscription Successful Popup Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-amber-400/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative flex flex-col items-center gap-4 animate-zoom-in">
            {/* Close Button */}
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Sparkle Banner Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-blue-950 font-black text-3xl flex items-center justify-center shadow-xl animate-bounce">
              🔥
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                ✅ Subscription Active!
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Loot Deals Alerts Activated
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300">
                Contact <span className="font-bold text-blue-600 dark:text-amber-400">{subscriberEmail}</span> added to ST Mart VIP Deals Broadcast. You will receive direct alerts on massive discounts!
              </p>
            </div>

            {/* WhatsApp Direct Action Button */}
            <a
              href={waDirectUrl || `https://wa.me/919589018011?text=${encodeURIComponent("🔥 I have subscribed to ST Mart Deals Alerts! Please send daily Amazon & Flipkart loot deals.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <span>📲</span>
              <span>Connect on WhatsApp for Instant Alerts</span>
            </a>

            <button
              onClick={() => setShowClaimModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300 font-bold underline cursor-pointer"
            >
              Continue Browsing Deals
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeView;
