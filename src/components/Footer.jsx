function Footer({ setView }) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs mt-12 border-t border-zinc-800/80">
      {/* Top Banner Brand Bar */}
      <div className="bg-zinc-900/80 border-b border-zinc-800/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-xl font-black italic tracking-wide text-white">
              ST <span className="text-amber-400">Mart</span>
            </span>
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/20 uppercase tracking-wider">
              Plus✦ Store
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-400 text-center sm:text-right">
            India's Most Trusted Shopping & E-Commerce Destination 🚀
          </p>
        </div>
      </div>

      {/* Main Footer Links Grid (Compact Spacing & Smaller Text) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        
        {/* Column 1: About */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800/80 pb-1.5 mb-1">
            About ST Mart
          </h4>
          <button onClick={() => setView && setView("contact")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Contact Us
          </button>
          <button onClick={() => setView && setView("about")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            About Us
          </button>
          <button onClick={() => setView && setView("careers")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Careers
          </button>
          <button onClick={() => setView && setView("stories")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            ST Mart Stories
          </button>
          <button onClick={() => setView && setView("press")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Press Releases
          </button>
        </div>

        {/* Column 2: Customer Help */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800/80 pb-1.5 mb-1">
            Customer Help
          </h4>
          <button onClick={() => setView && setView("payments")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Payments
          </button>
          <button onClick={() => setView && setView("shipping")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Shipping & Delivery
          </button>
          <button onClick={() => setView && setView("returns")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Cancellation & Returns
          </button>
          <button onClick={() => setView && setView("faq")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            FAQ / Help Center
          </button>
        </div>

        {/* Column 3: Consumer Policy */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800/80 pb-1.5 mb-1">
            Consumer Policy
          </h4>
          <button onClick={() => setView && setView("return-policy")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Return Policy
          </button>
          <button onClick={() => setView && setView("terms")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Terms Of Use
          </button>
          <button onClick={() => setView && setView("security")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Security & Safety
          </button>
          <button onClick={() => setView && setView("privacy")} className="text-left text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer py-0.5">
            Privacy Details
          </button>
        </div>

        {/* Column 4: Social Channels */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800/80 pb-1.5 mb-1">
            Social Channels
          </h4>
          
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 transition-colors py-0.5 group"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            Facebook Page
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-sky-400 transition-colors py-0.5 group"
          >
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            Twitter / X
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-red-400 transition-colors py-0.5 group"
          >
            <div className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            YouTube Channel
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-pink-400 transition-colors py-0.5 group"
          >
            <div className="w-6 h-6 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            Instagram Page
          </a>
        </div>

      </div>

      {/* Bottom Copyright & Extra Links Bar */}
      <div className="border-t border-zinc-800/80 py-4 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <span className="font-extrabold italic text-amber-400">ST Mart✦</span>
          <span>© 2026 ST Mart.com. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-zinc-300">
          <button onClick={() => setView && setView("seller")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Become a Seller
          </button>
          <button onClick={() => setView && setView("advertise")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Advertise with Us
          </button>
          <button onClick={() => setView && setView("gift-cards")} className="hover:text-amber-400 cursor-pointer transition-colors">
            Gift Cards
          </button>
          <button onClick={() => setView && setView("admin")} className="text-zinc-600 dark:text-zinc-500 hover:text-amber-400 cursor-pointer transition-colors text-[10px]">
            ✦ Owner Portal
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
