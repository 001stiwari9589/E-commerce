import { useEffect } from "react";

function CartPage({
  cartItems,
  updateQuantity,
  removeFromCart,
  onCheckout,
  onBack,
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalCurrentPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalDiscount = totalOriginalPrice - totalCurrentPrice;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const deliveryCharge = totalCurrentPrice > 500 || totalCurrentPrice === 0 ? 0 : 40;
  const finalPrice = totalCurrentPrice + deliveryCharge;

  return (
    <div className="bg-transparent animate-fade-in text-slate-800 dark:text-zinc-150 transition-colors">
      
      {/* Back link */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Continue Shopping
      </button>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
              Shopping Cart ({totalItemsCount} items)
            </h2>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-555 mb-4 animate-bounce">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
                  Your cart is empty!
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-[280px]">
                  Add items to your cart now to check out amazing deals and deep discounts.
                </p>
                <button
                  onClick={onBack}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-all"
                >
                  Shop Best Deals
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 dark:border-zinc-800 pb-5 last:border-0 last:pb-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 shrink-0 bg-slate-50 dark:bg-zinc-850 rounded-xl p-2.5 flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-450 transition-colors cursor-pointer shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                          Seller: AdrsMart Retailer
                        </p>

                        {/* Prices */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-black text-base text-slate-900 dark:text-white">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                              ₹{(item.originalPrice * item.qty).toLocaleString("en-IN")}
                            </span>
                          )}
                          {item.discount > 0 && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
                              {item.discount}% Off
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity operations */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-800">
                          <button
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="px-3 py-1 text-slate-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-xs font-bold text-slate-900 dark:text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="px-3 py-1 text-slate-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout statistics */}
        <div className="flex flex-col gap-4">
          {cartItems.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xs p-5 md:p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-3">
                Price Details Summary
              </h3>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">Price ({totalItemsCount} items)</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  ₹{totalOriginalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-zinc-400">Discount Savings</span>
                  <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                    - ₹{totalDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">Delivery Charges</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase">
                      Free Delivery
                    </span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 my-1"></div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Payable</span>
                <span>₹{finalPrice.toLocaleString("en-IN")}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-950/30">
                  <svg className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span>Woohoo! You saved ₹{totalDiscount.toLocaleString("en-IN")} on this order</span>
                </div>
              )}

              <button
                onClick={onCheckout}
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl text-center shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm mt-3"
              >
                Confirm Order & Checkout
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default CartPage;
