import { useState } from "react";

function OrderTrackingModal({ isOpen, onClose, order, triggerToast }) {
  const [activeTab, setActiveTab] = useState("map"); // 'map' | 'timeline' | 'agent'
  const [mapType, setMapType] = useState("google"); // 'google' | 'animated'
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [showRescheduleMsg, setShowRescheduleMsg] = useState(false);

  if (!isOpen) return null;

  // Format user's exact shipping address from order
  const formattedAddress = order?.shippingAddress
    ? `${order.shippingAddress.fullName ? `${order.shippingAddress.fullName}, ` : ""}${order.shippingAddress.streetAddress || ""}, ${order.shippingAddress.area || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.pincode || ""}`
    : (order?.deliveryAddress || "Connaught Place, Central Delhi, New Delhi - 110001");

  const pincode = order?.shippingAddress?.pincode || "110001";
  const cityName = order?.shippingAddress?.city || "New Delhi";

  // Google Maps Search Query using user's entered address
  const googleMapSearch = encodeURIComponent(
    order?.shippingAddress?.streetAddress
      ? `${order.shippingAddress.streetAddress}, ${cityName}, ${pincode}`
      : `${formattedAddress}`
  );

  const googleMapsUrl = `https://maps.google.com/maps?q=${googleMapSearch}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const trackData = {
    id: order?.id || "ORD-839120",
    date: order?.date || (order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "20 Aug 2026"),
    expectedDelivery: order?.expectedDelivery || "In 1-2 Days (Tomorrow by 2:00 PM)",
    status: order?.status || "In Transit",
    statusStep: order?.statusStep || (order?.status === "Delivered" ? 5 : order?.status === "In Transit" ? 3 : 1),
    item: order?.item || (order?.items && order.items[0] ? order.items[0].name : "ST Mart Product"),
    brand: order?.brand || (order?.items && order.items[0] ? order.items[0].brand || "ST Mart" : "ST Mart"),
    image: order?.image || (order?.items && order.items[0] ? order.items[0].image : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
    trackingNo: order?.trackingNo || order?.transactionId || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
    courier: order?.courier || "STMart Express Logistics",
    deliveryAddress: formattedAddress,
    originStore: "ST Mart Hub & Central Store, Connaught Place, New Delhi",
    deliveryAgent: {
      name: "Ramesh Kumar 🛵",
      phone: "+91 95890 18011",
      rating: "4.9 ★",
      deliveriesCompleted: "1,420+",
      otp: "7492",
    },
    currentLocation: `ST Mart Local Delivery Hub, near ${cityName} (${pincode})`,
  };

  const trackingTimeline = [
    {
      time: "Today, 4:30 PM",
      title: "Out for Delivery",
      desc: `Delivery Agent Ramesh Kumar is en-route to ${cityName}.`,
      location: `ST Mart Delivery Center, ${cityName}`,
      done: trackData.statusStep >= 4,
      current: trackData.statusStep === 4,
    },
    {
      time: "Today, 11:15 AM",
      title: "Arrived at Regional Sorting Hub",
      desc: `Package scanned and sorted for PIN ${pincode}.`,
      location: `ST Regional Hub, ${cityName}`,
      done: trackData.statusStep >= 3,
      current: trackData.statusStep === 3,
    },
    {
      time: "Yesterday, 8:40 PM",
      title: "In Transit - Shipped",
      desc: "Dispatched from ST Mart Central Fulfillment Store.",
      location: "ST Central Store & Hub, Connaught Place, New Delhi",
      done: trackData.statusStep >= 2,
      current: trackData.statusStep === 2,
    },
    {
      time: "Yesterday, 3:10 PM",
      title: "Order Packed & ST Assured Quality Checked",
      desc: "Item verified by 6-step quality audit & sealed in tamper-proof box.",
      location: "ST Fulfillment Store #1",
      done: trackData.statusStep >= 1,
      current: false,
    },
    {
      time: "Yesterday, 1:00 PM",
      title: "Order Placed & Payment Authorized",
      desc: `Order ${trackData.id} confirmed for ${formattedAddress}.`,
      location: "ST Mart Store Server",
      done: true,
      current: false,
    },
  ];

  const handleShareTracking = () => {
    const trackingUrl = `${window.location.origin}?track=${trackData.trackingNo}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      if (triggerToast) triggerToast("Tracking Link copied to clipboard!", "success");
    }
  };

  const handleReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    setShowRescheduleMsg(true);
    if (triggerToast) triggerToast(`Delivery successfully rescheduled to ${rescheduleDate}!`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fade-in text-slate-800 dark:text-zinc-150">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Main Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[92vh] z-10 animate-zoom-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ST MART EXPRESS LIVE TRACKING 🚚
              </span>
              <span className="text-xs font-mono text-blue-200">{trackData.trackingNo}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              Order Location Tracking
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Order ID: <strong className="text-amber-300 font-mono">{trackData.id}</strong> | Estimated Delivery: <strong className="text-white font-bold">{trackData.expectedDelivery}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center text-lg transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* Top Quick Status Summary Card */}
          <div className="bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={trackData.image}
                alt={trackData.item}
                className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-zinc-800 p-1 border border-gray-200 dark:border-zinc-700 shrink-0"
              />
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-amber-400 tracking-wider">
                  {trackData.brand}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {trackData.item}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Courier Partner: <strong className="text-slate-800 dark:text-zinc-200">{trackData.courier}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end w-full sm:w-auto gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200 dark:border-zinc-750">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">Live Status</span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                {trackData.status}
              </span>
            </div>
          </div>

          {/* View Tab Buttons (Map View / Live Milestones / Agent & Delivery Details) */}
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3">
            {[
              { id: "map", label: "📍 Google Maps Location Trace" },
              { id: "timeline", label: "📋 Milestones & Logs" },
              { id: "agent", label: "🛵 Delivery Agent & OTP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: GOOGLE MAPS & LIVE ROUTE INTERACTIVE TRACE */}
          {activeTab === "map" && (
            <div className="space-y-4">
              
              {/* Map Mode Toggle Switcher */}
              <div className="flex items-center justify-between bg-slate-100 dark:bg-zinc-800 p-2 rounded-xl border border-gray-200 dark:border-zinc-750">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 dark:text-zinc-200">View Mode:</span>
                  <button
                    type="button"
                    onClick={() => setMapType("google")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mapType === "google"
                        ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    📍 Google Maps Live Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapType("animated")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mapType === "animated"
                        ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🛵 ST Mart Route Graphic
                  </button>
                </div>

                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                  ✓ Customer Address Traced
                </span>
              </div>

              {mapType === "google" ? (
                /* Google Maps Real Location Embed */
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-md">
                  <iframe
                    title="Google Maps Order Location"
                    src={googleMapsUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white p-3 rounded-xl border border-slate-700 text-xs shadow-lg max-w-xs backdrop-blur-xs">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">Customer Delivery Address</span>
                    <span className="font-extrabold text-slate-100 leading-snug block">{trackData.deliveryAddress}</span>
                  </div>
                </div>
              ) : (
                /* ST Mart Animated Live GPS Route Canvas */
                <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-4">
                  {/* Map Grid Graphic */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500/60 stroke-[3] fill-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 200 Q 200 80, 400 150 T 700 80" strokeDasharray="6,6" className="animate-pulse" />
                  </svg>

                  {/* Start Warehouse Marker */}
                  <div className="absolute top-12 left-10 flex flex-col items-center gap-1 z-10">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-blue-400 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                      🏬
                    </div>
                    <span className="bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">
                      ST Mart Central Store (New Delhi)
                    </span>
                  </div>

                  {/* Current Live Moving Vehicle Pin */}
                  <div className="absolute top-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 animate-bounce">
                    <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                      Live Location: {trackData.currentLocation}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white text-white flex items-center justify-center text-xl shadow-2xl">
                      🛵
                    </div>
                  </div>

                  {/* Destination Home Marker */}
                  <div className="absolute bottom-10 right-10 flex flex-col items-center gap-1 z-10">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-sm font-bold shadow-lg">
                      🏠
                    </div>
                    <span className="bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">
                      Customer Delivery Address
                    </span>
                  </div>

                  {/* Map Overlay Footer Status */}
                  <div className="relative z-20 mt-auto bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-white flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery Address</span>
                        <span className="font-extrabold text-slate-200">{trackData.deliveryAddress}</span>
                      </div>
                    </div>
                    <span className="text-amber-400 font-mono font-bold bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                      ETA: {trackData.expectedDelivery}
                    </span>
                  </div>
                </div>
              )}

              {/* Origin to Destination Trace Details */}
              <div className="bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    🏬
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Origin Store / Warehouse</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">{trackData.originStore}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    📍
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Delivery Address</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">{trackData.deliveryAddress}</strong>
                  </div>
                </div>
              </div>

              {/* Delivery Agent Bar */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md shrink-0">
                    🛵
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm">{trackData.deliveryAgent.name}</h4>
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                        {trackData.deliveryAgent.rating}
                      </span>
                    </div>
                    <p className="text-xs text-blue-200">
                      ST Mart Express Verified Partner ({trackData.deliveryAgent.deliveriesCompleted} orders delivered)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[9px] text-blue-200 uppercase font-bold block">Delivery PIN / OTP</span>
                    <span className="font-mono font-black text-base text-amber-300 tracking-wider">
                      {trackData.deliveryAgent.otp}
                    </span>
                  </div>
                  <a
                    href={`tel:${trackData.deliveryAgent.phone}`}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    📞 Call Agent
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Detailed Logistics Tracking Log
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-800">
                {trackingTimeline.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Step Icon Indicator */}
                    <div
                      className={`absolute -left-6 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                        item.done
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                          : item.current
                          ? "bg-blue-600 text-white border-blue-400 animate-pulse"
                          : "bg-white dark:bg-zinc-800 text-slate-400 border-gray-300 dark:border-zinc-700"
                      }`}
                    >
                      {item.done ? "✓" : index + 1}
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-zinc-850 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`text-xs font-extrabold ${item.done ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400"}`}>
                          {item.title}
                        </h5>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-amber-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block pt-1">
                        📍 {item.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AGENT & RESCHEDULE OPTIONS */}
          {activeTab === "agent" && (
            <div className="space-y-5">
              <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛵</span> Assigned Delivery Executive Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-zinc-300">
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Agent Name</span>
                    <strong className="text-slate-900 dark:text-white text-sm font-extrabold">{trackData.deliveryAgent.name}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact Phone</span>
                    <strong className="text-blue-600 dark:text-amber-400 text-sm font-bold">{trackData.deliveryAgent.phone}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Verification Security OTP</span>
                    <strong className="text-amber-500 font-mono text-base font-black">{trackData.deliveryAgent.otp}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Courier Service</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">{trackData.courier}</strong>
                  </div>
                </div>
              </div>

              {/* Reschedule Delivery Date */}
              <form onSubmit={handleReschedule} className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>📅</span> Reschedule Delivery Date
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Not available at home? Choose your preferred date for delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Confirm Reschedule
                  </button>
                </div>

                {showRescheduleMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    ✓ Delivery date updated to {rescheduleDate}. Courier partner notified!
                  </p>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 dark:bg-zinc-850 p-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShareTracking}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🔗</span> Share Tracking Link
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderTrackingModal;
