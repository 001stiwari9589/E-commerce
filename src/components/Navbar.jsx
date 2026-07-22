import { useState } from "react";

function Navbar({
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  toggleDarkMode,
  setView,
  view,
  userEmail,
  onLogout,
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleBecomeSeller = () => {
    setView("seller");
  };

  const getUserDisplayName = (email) => {
    if (!email) return "My Account";
    const namePart = email.split("@")[0];
    if (/^\d+$/.test(namePart)) {
      return `User ${namePart.slice(-4)}`;
    }
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const displayName = getUserDisplayName(userEmail);
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="bg-blue-600 dark:bg-zinc-950 text-white sticky top-0 z-40 shadow-md transition-colors px-4 py-3 md:py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3.5 md:gap-8">

        {/* Top Line: Brand & Action Buttons (Mobile View Optimization) */}
        <div className="w-full flex items-center justify-between md:w-auto shrink-0">
          {/* Logo */}
          <button
            onClick={() => {
              setSearchQuery("");
              setView("home");
            }}
            className="flex flex-col items-start cursor-pointer group text-left"
          >
            <span className="text-xl md:text-2xl font-black italic tracking-wide flex items-center gap-0.5 leading-none">
              Adrs  <span className="text-yellow-400">Mart</span>
            </span>
            <span className="text-[9px] font-bold italic text-gray-150 flex items-center gap-0.5 group-hover:text-yellow-300 transition-colors leading-none mt-0.5">
              Explore <span className="text-yellow-400 font-extrabold">Plus✦</span>
            </span>
          </button>

          {/* Quick Icons for Mobile Layout */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full text-white/95 hover:text-white dark:hover:text-amber-400 cursor-pointer"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setView("wishlist")}
              className={`relative p-1 rounded-full cursor-pointer transition-colors ${view === "wishlist" ? "text-yellow-400" : "text-white hover:text-rose-350"
                }`}
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setView("cart")} className={`relative p-1 cursor-pointer transition-colors ${view === "cart" ? "text-yellow-450" : "text-white hover:text-yellow-300"
              }`}>
              <svg className="w-6.5 h-6.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Input (Expansive Center) */}
        <div className="w-full flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Go to home view if user is searching
                if (view !== "home" && view !== "category") setView("home");
              }}
              className="w-full py-2 pl-4 pr-10 text-slate-800 dark:text-white bg-slate-50 dark:bg-zinc-850 rounded-lg placeholder-gray-400 dark:placeholder-zinc-500 font-medium text-sm focus:bg-white dark:focus:bg-zinc-800 transition-colors shadow-inner border-0 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-amber-500"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop Buttons List */}
        <div className="hidden md:flex items-center gap-6 shrink-0">

          {/* User Sign-In / Login Status */}
          {userEmail ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 font-extrabold hover:text-yellow-300 transition-colors cursor-pointer text-sm py-1"
              >
                {/* First Letter Avatar Badge */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-blue-950 font-black text-xs flex items-center justify-center shadow-md border border-white/30 shrink-0 uppercase">
                  {firstLetter}
                </div>
                <span className="font-extrabold text-sm max-w-[120px] truncate">
                  {displayName}
                </span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Logged in Options Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 text-slate-800 dark:text-zinc-200 z-50 animate-zoom-in">

                  {/* Profile Header Block */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-850 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-blue-950 font-black text-sm flex items-center justify-center shadow-xs shrink-0 uppercase">
                      {firstLetter}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                          {displayName}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                        @{displayName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setView("account");
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-blue-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    My Profile & Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setView("orders");
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                    My Orders
                  </button>

                  <button
                    onClick={() => {
                      setView("wishlist");
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    My Wishlist
                  </button>

                  <div className="border-t border-gray-100 dark:border-zinc-850 my-1"></div>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 text-rose-500 hover:text-rose-600 dark:hover:text-rose-450 cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setView("login")}
              className={`font-bold text-sm px-6 py-1.5 rounded-md transition-colors cursor-pointer shadow-md ${view === "login"
                ? "bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                : "bg-white hover:bg-gray-100 text-blue-600 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950"
                }`}
            >
              Login
            </button>
          )}

          {/* Become a Seller */}
          <button
            onClick={handleBecomeSeller}
            className="text-sm font-bold hover:text-yellow-300 transition-colors cursor-pointer"
          >
            Become a Seller
          </button>

          {/* Wishlist Link (Desktop) */}
          <button
            onClick={() => setView("wishlist")}
            className={`relative flex items-center gap-1 text-sm font-bold cursor-pointer transition-colors ${view === "wishlist" ? "text-yellow-400" : "hover:text-yellow-300 text-white"
              }`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2.5 -right-3.5 bg-red-500 text-white font-extrabold text-[8.5px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Page Toggle (Desktop) */}
          <button
            onClick={() => setView("cart")}
            className={`relative flex items-center gap-1.5 font-bold cursor-pointer text-sm transition-colors ${view === "cart" ? "text-yellow-400" : "text-white hover:text-yellow-300"
              }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-yellow-400 text-blue-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full animate-pulse ml-0.5">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark Mode Control */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-white cursor-pointer transition-colors shadow-sm"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
