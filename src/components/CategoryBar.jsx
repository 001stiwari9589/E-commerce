import { useRef } from "react";

function CategoryBar({ activeCategory, setActiveCategory }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const categories = [
    {
      id: "all",
      name: "All Products",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      id: "mobiles",
      name: "Mobiles",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      ),
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      id: "home",
      name: "Home & Living",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: "appliances",
      name: "Appliances",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      id: "toys",
      name: "Beauty & Toys",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      id: "grocery",
      name: "Grocery & Food",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125V18.75m9 0h1.5a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5h-1.5m-9 12H4.5A1.5 1.5 0 013 17.25v-9A1.5 1.5 0 014.5 6.75h1.5" />
        </svg>
      ),
    },
    {
      id: "books",
      name: "Books & Stationery",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      id: "footwear",
      name: "Footwear & Shoes",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5 7.5-7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75L21.75 12 18 20.25H6L2.25 12z" />
        </svg>
      ),
    },
    {
      id: "gaming",
      name: "Gaming & Gear",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.498-.57.842-.782.686-.425 1.62-.646 2.757-.646 1.137 0 2.071.221 2.757.646.344.212.621.492.842.782.215.283.401.604.401.959v.5c0 .355-.186.676-.401.959-.221.29-.498.57-.842.782-.686.425-1.62.646-2.757.646-1.137 0-2.071-.221-2.757-.646-.344-.212-.621-.492-.842-.782-.215-.283-.401-.604-.401-.959v-.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12M9 12h6m-9 3h12" />
        </svg>
      ),
    },
    {
      id: "jewelry",
      name: "Jewelry & Watches",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "automotive",
      name: "Auto & Car Accessories",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12l1.5-4.5h13.5l1.5 4.5v4.5H3.75V12z" />
        </svg>
      ),
    },
    {
      id: "pets",
      name: "Pet Supplies",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-150 dark:border-zinc-800 shadow-xs py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 relative flex items-center">
        {/* Left Carousel Nav Button */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center hover:bg-blue-50 dark:hover:bg-zinc-700 hover:scale-110 cursor-pointer transition-all active:scale-95 shrink-0"
          title="Previous Categories"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth flex items-center justify-start gap-3 sm:gap-6 md:gap-8 px-9 sm:px-11 py-1"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 min-w-[75px] sm:min-w-[85px] cursor-pointer group transition-all duration-300 shrink-0 ${
                  isActive
                    ? "text-blue-600 dark:text-amber-500 scale-105"
                    : "text-gray-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-amber-400 hover:scale-102"
                }`}
              >
                <div
                  className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-amber-500/10 ring-2 ring-blue-500/20 dark:ring-amber-500/20"
                      : "bg-gray-50 dark:bg-zinc-800/50 group-hover:bg-blue-50/50 dark:group-hover:bg-zinc-800"
                  }`}
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-xs font-semibold tracking-wide whitespace-nowrap ${
                    isActive ? "font-bold text-blue-600 dark:text-amber-400" : ""
                  }`}
                >
                  {cat.name}
                </span>
                <div
                  className={`h-0.5 w-8 rounded transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 dark:bg-amber-500 scale-100"
                      : "bg-transparent scale-0 group-hover:scale-50 group-hover:bg-blue-300 dark:group-hover:bg-zinc-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Carousel Nav Button */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center hover:bg-blue-50 dark:hover:bg-zinc-700 hover:scale-110 cursor-pointer transition-all active:scale-95 shrink-0"
          title="Next Categories"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CategoryBar;
