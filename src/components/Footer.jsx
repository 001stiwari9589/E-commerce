function Footer({ setView }) {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-xs mt-12 border-t border-zinc-850">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* About Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">About</h4>
          <button onClick={() => setView && setView("contact")} className="text-left hover:underline hover:text-white cursor-pointer">Contact Us</button>
          <button onClick={() => setView && setView("about")} className="text-left hover:underline hover:text-white cursor-pointer">About Us</button>
          <button onClick={() => setView && setView("careers")} className="text-left hover:underline hover:text-white cursor-pointer">Careers</button>
          <button onClick={() => setView && setView("stories")} className="text-left hover:underline hover:text-white cursor-pointer">ST Mart Stories</button>
          <button onClick={() => setView && setView("press")} className="text-left hover:underline hover:text-white cursor-pointer">Press Releases</button>
        </div>

        {/* Help Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Help</h4>
          <button onClick={() => setView && setView("payments")} className="text-left hover:underline hover:text-white cursor-pointer">Payments</button>
          <button onClick={() => setView && setView("shipping")} className="text-left hover:underline hover:text-white cursor-pointer">Shipping</button>
          <button onClick={() => setView && setView("returns")} className="text-left hover:underline hover:text-white cursor-pointer">Cancellation &amp; Returns</button>
          <button onClick={() => setView && setView("faq")} className="text-left hover:underline hover:text-white cursor-pointer">FAQ / Help Center</button>
        </div>

        {/* Consumer Policy Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Consumer Policy</h4>
          <button onClick={() => setView && setView("return-policy")} className="text-left hover:underline hover:text-white cursor-pointer">Return Policy</button>
          <button onClick={() => setView && setView("terms")} className="text-left hover:underline hover:text-white cursor-pointer">Terms Of Use</button>
          <button onClick={() => setView && setView("security")} className="text-left hover:underline hover:text-white cursor-pointer">Security &amp; Safety</button>
          <button onClick={() => setView && setView("privacy")} className="text-left hover:underline hover:text-white cursor-pointer">Privacy Details</button>
        </div>

        {/* Social Channels Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Social Channels</h4>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Twitter / X</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">YouTube Channel</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Instagram Page</a>
        </div>

        {/* Office Address Column */}
        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-6 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Registered Office</h4>
          <p className="leading-relaxed text-zinc-500 text-[11px]">
            ST Mart Private Limited,<br />
            Buildings Alyssa, Begonia &amp; Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India.
          </p>
        </div>

      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-zinc-850/80 py-6 px-6 text-center text-[11px] text-zinc-650 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          <span className="font-extrabold italic text-zinc-200">ST Mart✦</span>
          <span>© 2026 ST Mart.com. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setView && setView("seller")} className="hover:underline hover:text-white cursor-pointer">Become a Seller Link</button>
          <button onClick={() => setView && setView("advertise")} className="hover:underline hover:text-white cursor-pointer">Advertise with Us</button>
          <button onClick={() => setView && setView("gift-cards")} className="hover:underline hover:text-white cursor-pointer">Gift Cards</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

