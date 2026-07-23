import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    title: "Electronics Grand Sale",
    subtitle: "Up to 80% Off on Premium Gadgets",
    desc: "Laptops, Smartwatches, Noise-Cancelling Headphones & more.",
    badge: "Limited Time Offer",
    gradient: "from-blue-600 via-indigo-700 to-indigo-900 dark:from-indigo-950 dark:via-zinc-900 dark:to-slate-950",
    buttonText: "Shop Electronics",
    category: "electronics",
    accentColor: "bg-amber-400 text-slate-900 hover:bg-yellow-300",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60", // Laptop
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60", // Headphones
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", // Apple Watch
    ],
  },
  {
    id: 2,
    title: "Fashion Fest Carnival",
    subtitle: "Min 50% - 80% Off",
    desc: "Upgrade your style with premium brands, shoes, jackets and apparel.",
    badge: "Big Brands, Big Deals",
    gradient: "from-rose-500 via-pink-600 to-rose-900 dark:from-rose-950 dark:via-zinc-900 dark:to-zinc-950",
    buttonText: "Explore Trends",
    category: "fashion",
    accentColor: "bg-white text-rose-600 font-bold hover:bg-rose-50",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60", // Nike Shoes
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60", // Denim Jacket
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60", // Sunglasses
    ],
  },
  {
    id: 3,
    title: "Mobile Bonanza Days",
    subtitle: "Up to ₹15,000 Exchange Bonus",
    desc: "Get the latest iPhone 15 Pro, Samsung Ultra & flagship devices.",
    badge: "Best Value Deals",
    gradient: "from-emerald-600 via-teal-700 to-slate-900 dark:from-teal-950 dark:via-zinc-900 dark:to-slate-950",
    buttonText: "Buy Mobiles Now",
    category: "mobiles",
    accentColor: "bg-yellow-400 text-slate-900 hover:bg-yellow-300",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60", // iPhone 15
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60", // Samsung S24
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60", // OnePlus 12
    ],
  },
  {
    id: 4,
    title: "Home Makeover Carnival",
    subtitle: "Deals starting from ₹99",
    desc: "Make your living space cozy. Sofas, curtains, kitchenware & more.",
    badge: "New Home Arrivals",
    gradient: "from-purple-600 via-indigo-800 to-purple-950 dark:from-purple-950 dark:via-zinc-900 dark:to-zinc-950",
    buttonText: "Revamp Home",
    category: "home",
    accentColor: "bg-white text-purple-700 font-bold hover:bg-purple-50",
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60", // Office Chair
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60", // Dinner Set
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60", // Lamp
    ],
  },
];

function HeroCarousel({ onSelectCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    startTimer();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setActiveIndex(index);
    startTimer();
  };

  return (
    <div
      className="relative w-full h-[280px] sm:h-[420px] md:h-[460px] overflow-hidden rounded-2xl shadow-2xl group border border-white/15"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Slides Container */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full h-full shrink-0 flex items-center justify-between bg-gradient-to-r ${slide.gradient} text-white px-4 sm:px-10 md:px-16 py-4 sm:py-6 relative overflow-hidden`}
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Left Content */}
            <div className="flex-1 max-w-lg z-10 flex flex-col items-start justify-center h-full animate-fade-in pr-2">
              <span className="bg-white/20 dark:bg-white/10 text-white text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider mb-1.5 sm:mb-3 border border-white/20 backdrop-blur-xs shadow-xs">
                {slide.badge}
              </span>
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-1 sm:mb-2 leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-2xl md:text-3xl font-extrabold text-yellow-300 dark:text-amber-400 mb-1.5 sm:mb-2">
                {slide.subtitle}
              </p>
              <p className="text-xs sm:text-base text-gray-100/90 mb-6 hidden sm:block max-w-md leading-relaxed">
                {slide.desc}
              </p>
              <button
                onClick={() => onSelectCategory(slide.category)}
                className={`px-4 sm:px-8 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl font-black text-xs sm:text-sm tracking-wide transform hover:-translate-y-1 transition-all cursor-pointer ${slide.accentColor}`}
              >
                {slide.buttonText}
              </button>
            </div>

            {/* Right Multiple Images Showcase Collage */}
            <div className="flex items-center justify-center relative w-[130px] sm:w-[320px] md:w-[420px] h-[200px] sm:h-[340px] md:h-[380px] z-10 shrink-0 select-none">
              
              {/* Image 1 (Main Right Card - Laptop / Primary) */}
              <div className="absolute top-2 sm:top-6 right-0 sm:right-2 w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-800 p-1.5 sm:p-2.5 shadow-2xl border-4 border-white dark:border-zinc-700 transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 z-20">
                <img
                  src={slide.images[0]}
                  alt={`${slide.title} 1`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60";
                  }}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                />
              </div>

              {/* Image 2 (Front Overlapping Center Card - Headphones / Secondary) */}
              <div className="absolute bottom-2 sm:bottom-6 left-0 sm:left-4 w-24 h-24 sm:w-38 sm:h-38 md:w-48 md:h-48 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-800 p-1.5 sm:p-2.5 shadow-2xl border-4 border-white dark:border-zinc-700 transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 z-30">
                <img
                  src={slide.images[1]}
                  alt={`${slide.title} 2`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";
                  }}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                />
              </div>

              {/* Image 3 (Background Top Left Card - Watch / Tertiary) */}
              <div className="absolute top-0 left-4 sm:left-12 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-800 p-1.5 sm:p-2 shadow-xl border-4 border-white/90 dark:border-zinc-700 transform -rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 opacity-95">
                <img
                  src={slide.images[2]}
                  alt={`${slide.title} 3`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60";
                  }}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => handleDotClick(index, e)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex
                ? "w-8 bg-white shadow-md"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
