import { useEffect } from "react";

function ReceiptModal({ order, isOpen, onClose, onViewOrders }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
      });

  const subtotal = (order.items || []).reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalDiscount = (order.items || []).reduce(
    (acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.qty,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white print:static">
      {/* Background click overlay */}
      <div className="absolute inset-0 cursor-pointer print:hidden" onClick={onClose}></div>

      {/* Main Receipt Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 text-slate-800 dark:text-zinc-150 border border-gray-150 dark:border-zinc-800 print:shadow-none print:border-none print:max-h-none print:w-full print:rounded-none print:bg-white print:text-black">
        
        {/* Printable Section Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 overflow-y-auto no-scrollbar print:overflow-visible print:p-0">
          
          {/* Success Banner (Screen only) */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 print:hidden">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-700 dark:text-emerald-400">
                Order Placed Successfully! (ऑर्डर सफलतापूर्वक दर्ज हुआ)
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Thank you for your purchase. Your invoice details &amp; payment receipt are below.
              </p>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 dark:border-zinc-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-amber-500 text-white font-black text-xl px-3 py-1 rounded-xl tracking-wider">
                  ST MART
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-md uppercase tracking-wider">
                  Tax Invoice / रसीद
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                ST Mart Retail Private Limited, Registered Store
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                GSTIN: 07AAAAA0000A1Z5 | Support: support@stmart.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Invoice No</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{order.invoiceNo || `INV-${order.id}`}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{formattedDate}</p>
            </div>
          </div>

          {/* Meta Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 dark:border-zinc-800 text-xs">
            {/* Delivery Address */}
            <div className="bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 print:border-gray-300 print:bg-white">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-blue-600 dark:text-amber-500">
                Delivered To / ग्राहक विवरण
              </h4>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{order.shippingAddress?.fullName || "Valued Customer"}</p>
              <p className="text-slate-600 dark:text-zinc-300 mt-1">
                {order.shippingAddress?.streetAddress || "Address Not Specified"}
              </p>
              <p className="text-slate-600 dark:text-zinc-300">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-slate-500 dark:text-zinc-400 mt-1 font-semibold">
                Mobile: +91 {order.shippingAddress?.phone || "N/A"}
              </p>
            </div>

            {/* Payment & Order Details */}
            <div className="bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 print:border-gray-300 print:bg-white flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-blue-600 dark:text-amber-500">
                  Payment Details / भुगतान विवरण
                </h4>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-zinc-400">Order ID:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-zinc-400">Payment Mode:</span>
                  <span className="font-bold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[11px]">
                    {order.paymentMethod || "UPI Payment"}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 dark:text-zinc-400">Transaction ID:</span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300 text-[11px]">{order.transactionId}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Payment Status:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  PAID / SUCCESS
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6 border-b border-gray-200 dark:border-zinc-800">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Order Items Summary / खरीदे गए सामान
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-2">Product Details</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx} className="text-slate-800 dark:text-zinc-200">
                      <td className="py-3 pr-2">
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">Brand: {item.brand || "ST Mart Retail"}</p>
                      </td>
                      <td className="py-3 px-2 text-center font-bold">{item.qty}</td>
                      <td className="py-3 px-2 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="py-3 pl-2 text-right font-extrabold text-slate-900 dark:text-white">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="text-slate-500 dark:text-zinc-400 space-y-1">
              <p className="font-medium">✓ Inclusive of all Applicable Central &amp; State GST Taxes</p>
              <p className="font-medium">✓ 7 Days Easy Return &amp; Replacement Guaranteed</p>
              <p className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                Printed on: {new Date().toLocaleString("en-IN")}
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-2 print:border-gray-300 print:bg-white">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount Offered</span>
                  <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-base text-blue-600 dark:text-amber-500">
                  ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500">
            Thank you for shopping with <strong className="text-slate-700 dark:text-zinc-300">ST Mart</strong>! This is a computer-generated invoice receipt.
          </div>

        </div>

        {/* Modal Bottom Buttons (Hidden on Print) */}
        <div className="p-4 sm:p-5 bg-slate-100 dark:bg-zinc-850 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231a1.125 1.125 0 01-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-19.126 0C1.04 7.441.272 8.375.272 9.456v6.294A2.25 2.25 0 002.523 18h1.092" />
            </svg>
            Print Receipt / PDF (रसीद प्रिंट करें)
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onViewOrders) onViewOrders();
              }}
              className="flex-1 sm:flex-initial px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              View My Orders
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-3 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReceiptModal;
