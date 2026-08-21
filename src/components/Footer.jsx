function Footer({ setView }) {
  return (
    <footer className="bg-zinc-950 text-zinc-200 text-base mt-20 border-t border-zinc-800 shadow-2xl">
      {/* Top Banner Brand Bar */}
      <div className="bg-zinc-900/95 border-b border-zinc-800 py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-black italic tracking-wide text-white">
              ST <span className="text-amber-400">Mart</span>
            </span>
            <span className="bg-amber-400/20 text-amber-400 text-xs sm:text-sm font-black px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">
              Plus✦ Store
            </span>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-zinc-300 text-center sm:text-right">
            India's Most Trusted Shopping & E-Commerce Destination 🚀
          </p>
        </div>
      </div>

      {/* Main Footer Links Grid (4 Equal Columns Evenly Spaced) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 justify-between">
        
        {/* Column 1: About */}
        <div className="flex flex-col gap-4">
          <h4 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3">
            About ST Mart
          </h4>
          <button onClick={() => setView && setView("contact")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Contact Us
          </button>
          <button onClick={() => setView && setView("about")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            About Us
          </button>
          <button onClick={() => setView && setView("careers")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Careers
          </button>
          <button onClick={() => setView && setView("stories")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            ST Mart Stories
          </button>
          <button onClick={() => setView && setView("press")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Press Releases
          </button>
        </div>

        {/* Column 2: Customer Help */}
        <div className="flex flex-col gap-4">
          <h4 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3">
            Customer Help
          </h4>
          <button onClick={() => setView && setView("payments")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Payments
          </button>
          <button onClick={() => setView && setView("shipping")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Shipping & Delivery
          </button>
          <button onClick={() => setView && setView("returns")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Cancellation & Returns
          </button>
          <button onClick={() => setView && setView("faq")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            FAQ / Help Center
          </button>
        </div>

        {/* Column 3: Consumer Policy */}
        <div className="flex flex-col gap-4">
          <h4 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3">
            Consumer Policy
          </h4>
          <button onClick={() => setView && setView("return-policy")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Return Policy
          </button>
          <button onClick={() => setView && setView("terms")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Terms Of Use
          </button>
          <button onClick={() => setView && setView("security")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Security & Safety
          </button>
          <button onClick={() => setView && setView("privacy")} className="text-left text-base font-bold text-zinc-300 hover:text-amber-300 hover:translate-x-2 transition-all cursor-pointer py-1.5">
            Privacy Details
          </button>
        </div>

        {/* Column 4: Social Channels with Larger Vibrant Icons */}
        <div className="flex flex-col gap-4">
          <h4 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3">
            Social Channels
          </h4>
          
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 text-base font-bold text-zinc-300 hover:text-blue-400 hover:translate-x-2 transition-all py-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            Facebook Page
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 text-base font-bold text-zinc-300 hover:text-sky-400 hover:translate-x-2 transition-all py-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            Twitter / X
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 text-base font-bold text-zinc-300 hover:text-red-500 hover:translate-x-2 transition-all py-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            YouTube Channel
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 text-base font-bold text-zinc-300 hover:text-pink-400 hover:translate-x-2 transition-all py-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-pink-600/20 text-pink-500 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white transition-all shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            Instagram Page
          </a>
        </div>

      </div>

      {/* Bottom Copyright & Extra Links Bar */}
      <div className="border-t border-zinc-800/80 py-10 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-sm sm:text-base text-zinc-300">
        <div className="flex items-center gap-2 text-center md:text-left font-medium">
          <span className="font-extrabold italic text-amber-400">ST Mart✦</span>
          <span>© 2026 ST Mart.com. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-extrabold">
          <button onClick={() => setView && setView("seller")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Become a Seller
          </button>
          <button onClick={() => setView && setView("advertise")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Advertise with Us
          </button>
          <button onClick={() => setView && setView("gift-cards")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Gift Cards
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
