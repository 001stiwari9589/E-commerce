function Footer({ setView }) {
  return (
    <footer className="bg-zinc-950 text-zinc-300 text-sm mt-16 border-t border-zinc-800 shadow-2xl">
      {/* Top Banner Brand Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800/80 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-black italic tracking-wide text-white">
              ST <span className="text-yellow-400">Mart</span>
            </span>
            <span className="bg-yellow-400/20 text-yellow-400 text-xs font-black px-2.5 py-1 rounded-full border border-yellow-400/30 uppercase tracking-widest">
              Plus✦ Store
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-zinc-400 text-center sm:text-right">
            India's Most Trusted Shopping & E-Commerce Destination 🚀
          </p>
        </div>
      </div>

      {/* Main Footer Links Grid (1 Column on Mobile, 2 on Tablet, 5 on Desktop) */}
      <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
        
        {/* Column 1: About */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm sm:text-base font-black text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            About ST Mart
          </h4>
          <button onClick={() => setView && setView("contact")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Contact Us
          </button>
          <button onClick={() => setView && setView("about")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            About Us
          </button>
          <button onClick={() => setView && setView("careers")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Careers
          </button>
          <button onClick={() => setView && setView("stories")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            ST Mart Stories
          </button>
          <button onClick={() => setView && setView("press")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Press Releases
          </button>
        </div>

        {/* Column 2: Help */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm sm:text-base font-black text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            Customer Help
          </h4>
          <button onClick={() => setView && setView("payments")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Payments
          </button>
          <button onClick={() => setView && setView("shipping")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Shipping & Delivery
          </button>
          <button onClick={() => setView && setView("returns")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Cancellation & Returns
          </button>
          <button onClick={() => setView && setView("faq")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            FAQ / Help Center
          </button>
        </div>

        {/* Column 3: Policy */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm sm:text-base font-black text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            Consumer Policy
          </h4>
          <button onClick={() => setView && setView("return-policy")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Return Policy
          </button>
          <button onClick={() => setView && setView("terms")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Terms Of Use
          </button>
          <button onClick={() => setView && setView("security")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Security & Safety
          </button>
          <button onClick={() => setView && setView("privacy")} className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all cursor-pointer py-1">
            Privacy Details
          </button>
        </div>

        {/* Column 4: Social Channels */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm sm:text-base font-black text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            Social Channels
          </h4>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all py-1">
            Facebook Page
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all py-1">
            Twitter / X
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all py-1">
            YouTube Channel
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-left text-sm sm:text-base font-semibold text-zinc-300 hover:text-yellow-300 hover:translate-x-1 transition-all py-1">
            Instagram Page
          </a>
        </div>

        {/* Column 5: Office Address */}
        <div className="flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-6">
          <h4 className="text-sm sm:text-base font-black text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            Registered Office
          </h4>
          <p className="leading-relaxed text-zinc-400 text-xs sm:text-sm font-medium">
            <strong className="text-white block mb-1">ST Mart Private Limited</strong>
            Buildings Alyssa, Begonia &amp; Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli,<br />
            Bengaluru, 560103, Karnataka, India.
          </p>
        </div>

      </div>

      {/* Bottom Copyright & Extra Links Bar */}
      <div className="border-t border-zinc-800/80 py-8 px-6 text-xs sm:text-sm text-zinc-400 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-center md:text-left">
          <span className="font-extrabold italic text-white">ST Mart✦</span>
          <span>© 2026 ST Mart.com. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-bold text-xs sm:text-sm">
          <button onClick={() => setView && setView("seller")} className="hover:text-yellow-400 cursor-pointer transition-colors">
            Become a Seller
          </button>
          <button onClick={() => setView && setView("advertise")} className="hover:text-yellow-400 cursor-pointer transition-colors">
            Advertise with Us
          </button>
          <button onClick={() => setView && setView("gift-cards")} className="hover:text-yellow-400 cursor-pointer transition-colors">
            Gift Cards
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
