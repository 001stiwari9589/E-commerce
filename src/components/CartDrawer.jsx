import { useEffect } from "react";

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

function QtyBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-slate-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="bg-white dark:bg-zinc-850 p-3.5 rounded-xl border border-gray-150 dark:border-zinc-800 flex gap-4 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="w-20 h-20 shrink-0 bg-slate-50 dark:bg-zinc-800 rounded-lg p-1.5 flex items-center justify-center border border-gray-100 dark:border-zinc-750">
        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain rounded" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Seller: RetailPartner</p>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-bold text-sm text-slate-900 dark:text-white">{inr(item.price * item.qty)}</span>
            {item.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                {inr(item.originalPrice * item.qty)}
              </span>
            )}
            {item.discount > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">{item.discount}% Off</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-800">
            <QtyBtn onClick={() => updateQuantity(item.id, item.qty - 1)}>-</QtyBtn>
            <span className="px-3.5 py-1 text-xs font-bold text-slate-800 dark:text-zinc-200">{item.qty}</span>
            <QtyBtn onClick={() => updateQuantity(item.id, item.qty + 1)}>+</QtyBtn>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center h-80 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4 animate-bounce">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Your cart is empty!</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-[240px]">
        Add items to it now to bag amazing deals and heavy discounts.
      </p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white font-bold text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer shadow-md transition-all"
      >
        Shop Now
      </button>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, onCheckout }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const { totalOriginalPrice, totalCurrentPrice, totalItemsCount } = cartItems.reduce(
    (acc, item) => ({
      totalOriginalPrice: acc.totalOriginalPrice + (item.originalPrice || item.price) * item.qty,
      totalCurrentPrice: acc.totalCurrentPrice + item.price * item.qty,
      totalItemsCount: acc.totalItemsCount + item.qty,
    }),
    { totalOriginalPrice: 0, totalCurrentPrice: 0, totalItemsCount: 0 }
  );

  const totalDiscount = totalOriginalPrice - totalCurrentPrice;
  const deliveryCharge = totalCurrentPrice > 500 || totalCurrentPrice === 0 ? 0 : 40;
  const finalPrice = totalCurrentPrice + deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-md h-full bg-slate-50 dark:bg-zinc-900 shadow-2xl flex flex-col z-10 animate-slide-in-right text-slate-800 dark:text-zinc-150 border-l border-gray-150 dark:border-zinc-800">
        <div className="px-5 py-4 bg-white dark:bg-zinc-850 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Shopping Cart ({totalItemsCount})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <EmptyCart onClose={onClose} />
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 bg-white dark:bg-zinc-850 border-t border-gray-150 dark:border-zinc-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Price Details</h3>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-zinc-400">Price ({totalItemsCount} items)</span>
              <span className="text-slate-900 dark:text-white font-medium">{inr(totalOriginalPrice)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">Discount</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">- {inr(totalDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-zinc-400">Delivery Charges</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase">Free</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 my-1"></div>

            <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white">
              <span>Total Amount</span>
              <span>{inr(finalPrice)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 mt-1 border border-emerald-100 dark:border-emerald-900/30">
                <svg className="w-4 h-4 shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span>You will save {inr(totalDiscount)} on this order</span>
              </div>
            )}

            <button
              onClick={onCheckout}
              className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl text-center shadow-lg hover:shadow-xl transition-all cursor-pointer mt-2 transform active:scale-98"
            >
              Secure Checkout / Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}