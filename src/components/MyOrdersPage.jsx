import { useState, useEffect } from "react";

const initialOrders = [
  {
    id: "ORD-948201",
    date: "18 July 2026",
    expectedDelivery: "22 July 2026",
    status: "Delivered",
    statusStep: 4, // 1: Placed, 2: Shipped, 3: Out for Delivery, 4: Delivered
    statusColor: "emerald",
    total: 119900,
    item: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
    trackingNo: "AWB-78291039",
    courier: "AdrsExpress Logistics",
  },
  {
    id: "ORD-839120",
    date: "12 June 2026",
    expectedDelivery: "15 June 2026",
    status: "In Transit",
    statusStep: 2,
    statusColor: "blue",
    total: 29990,
    item: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    trackingNo: "AWB-49201948",
    courier: "Delhivery Courier",
  },
  {
    id: "ORD-710293",
    date: "04 May 2026",
    expectedDelivery: "07 May 2026",
    status: "Delivered",
    statusStep: 4,
    statusColor: "emerald",
    total: 7995,
    item: "Nike Air Max Pulse Lifestyle Sneakers",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    trackingNo: "AWB-10928472",
    courier: "Bluedart Express",
  },
];

function MyOrdersPage({ onBack, handleAddToCart, triggerToast }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'in-transit' | 'delivered'
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredOrders = orders.filter((ord) => {
    if (selectedFilter === "in-transit") return ord.status === "In Transit";
    if (selectedFilter === "delivered") return ord.status === "Delivered";
    return true;
  });

  const handleDownloadInvoice = (orderId) => {
    triggerToast(`Tax Invoice PDF for Order ${orderId} downloaded!`, "success");
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Store
        </button>
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
          My Order History &amp; Live Tracking
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
            Track live package status, view tax invoices, or re-order your favorite products.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-amber-400 shadow-xs"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setSelectedFilter("in-transit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "in-transit"
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-amber-400 shadow-xs"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            In Transit 🚚
          </button>
          <button
            onClick={() => setSelectedFilter("delivered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "delivered"
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-amber-400 shadow-xs"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Delivered ✓
          </button>
        </div>
      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-2xl text-slate-400">
            📦
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">No orders found in this view</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500">Explore our catalog and place your first order today!</p>
          <button onClick={onBack} className="mt-2 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
            Shop Catalog Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 hover:border-blue-300 dark:hover:border-zinc-700 transition-colors"
            >
              {/* Card Header Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-amber-400 border border-blue-100 dark:border-zinc-700">
                    {ord.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                    Placed on {ord.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      ord.status === "Delivered"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                        : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    ● {ord.status}
                  </span>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-zinc-800 p-2 border border-gray-100 dark:border-zinc-750 flex items-center justify-center shrink-0">
                    <img src={ord.image} alt={ord.item} className="max-w-full max-h-full object-contain rounded-lg" />
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block">
                      {ord.brand}
                    </span>
                    <h3 className="font-black text-base text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {ord.item}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1">
                      Courier: <strong className="text-slate-800 dark:text-zinc-200">{ord.courier}</strong> ({ord.trackingNo})
                    </p>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      Total: ₹{ord.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap sm:flex-col items-center sm:items-end justify-end w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTrackingOrder(activeTrackingOrder === ord.id ? null : ord.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {activeTrackingOrder === ord.id ? "Hide Live Timeline" : "Track Live Status 🚚"}
                  </button>

                  <button
                    onClick={() => handleDownloadInvoice(ord.id)}
                    className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    📄 Invoice
                  </button>
                </div>
              </div>

              {/* Live Tracking Progress Timeline (If Clicked) */}
              {activeTrackingOrder === ord.id && (
                <div className="mt-2 p-5 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-gray-200 dark:border-zinc-750 animate-fade-in flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-3">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Live Delivery Progress Timeline
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      Estimated Delivery: <strong className="text-blue-600 dark:text-amber-400">{ord.expectedDelivery}</strong>
                    </span>
                  </div>

                  {/* 4-Step Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 text-center relative py-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-200">Order Placed</span>
                      <span className="text-[9px] text-slate-400">{ord.date}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        ord.statusStep >= 2 ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-zinc-700 text-gray-500"
                      }`}>
                        {ord.statusStep >= 2 ? "✓" : "2"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-200">Shipped</span>
                      <span className="text-[9px] text-slate-400">Warehouse Hub</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        ord.statusStep >= 3 ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-zinc-700 text-gray-500"
                      }`}>
                        {ord.statusStep >= 3 ? "✓" : "3"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-200">Out for Delivery</span>
                      <span className="text-[9px] text-slate-400">Local Agent</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        ord.statusStep >= 4 ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-zinc-700 text-gray-500"
                      }`}>
                        {ord.statusStep >= 4 ? "✓" : "4"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-200">Delivered</span>
                      <span className="text-[9px] text-slate-400">{ord.expectedDelivery}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyOrdersPage;
