import { useState, useEffect } from "react";

function AccountDashboardPage({ userEmail, onLogout, setView, onBack }) {
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'profile' | 'addresses' | 'wallet'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Mock orders history
  const mockOrders = [
    {
      id: "ORD-948201",
      date: "18 July 2026",
      status: "Delivered",
      statusColor: "emerald",
      total: 119900,
      item: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "ORD-839120",
      date: "12 June 2026",
      status: "In Transit",
      statusColor: "blue",
      total: 29990,
      item: "Sony WH-1000XM5 Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    },
  ];

  const getUserDisplayName = (email) => {
    if (!email) return "Valued Customer";
    const namePart = email.split("@")[0];
    if (/^\d+$/.test(namePart)) {
      return `User ${namePart.slice(-4)}`;
    }
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const displayName = getUserDisplayName(userEmail);
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 animate-fade-in text-slate-800 dark:text-zinc-150 my-4">
      
      {/* Navigation breadcrumb */}
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
          User Account Dashboard
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar Menu */}
        <div className="md:col-span-1 flex flex-col gap-4">
          
          {/* User Brief Info Card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-blue-950 font-black text-xl flex items-center justify-center uppercase shadow-md shrink-0">
              {firstLetter}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-amber-400 uppercase tracking-widest block">
                ✦ Plus Member
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                {displayName}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                @{displayName}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-2 shadow-xs flex flex-col gap-1">
            
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                activeTab === "orders"
                  ? "bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-amber-400"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-650 dark:text-zinc-400"
              }`}
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              My Orders & History
            </button>

            <button
              onClick={() => setView("wishlist")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-650 dark:text-zinc-400 transition-colors cursor-pointer text-left"
            >
              <svg className="w-4.5 h-4.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              My Saved Wishlist
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                activeTab === "profile"
                  ? "bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-amber-400"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-650 dark:text-zinc-400"
              }`}
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Profile Settings
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                activeTab === "addresses"
                  ? "bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-amber-400"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-650 dark:text-zinc-400"
              }`}
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Manage Delivery Addresses
            </button>

            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                activeTab === "wallet"
                  ? "bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-amber-400"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-650 dark:text-zinc-400"
              }`}
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563A.563.563 0 019 14.437V9.563z" />
              </svg>
              AdrsMart Pay & Gift Cards
            </button>

            <div className="border-t border-gray-100 dark:border-zinc-800 my-1 pt-1">
              <button
                onClick={() => {
                  onLogout();
                  onBack();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign Out Account
              </button>
            </div>

          </div>
        </div>

        {/* Right Tab Contents */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {activeTab === "orders" && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Orders History ({mockOrders.length})
                </h3>
                <span className="text-xs text-slate-400 dark:text-zinc-500">
                  Showing recent purchases
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {mockOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-gray-150 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow bg-slate-50/50 dark:bg-zinc-850/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-white dark:bg-zinc-800 p-1 border border-gray-100 dark:border-zinc-750 flex items-center justify-center shrink-0">
                        <img src={ord.image} alt={ord.item} className="max-w-full max-h-full object-contain rounded" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-zinc-750 text-blue-700 dark:text-amber-400">
                            {ord.id}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-zinc-500">{ord.date}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          {ord.item}
                        </h4>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-zinc-300 mt-1 block">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-150 dark:border-zinc-800">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ord.statusColor === "emerald"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                      }`}>
                        ● {ord.status}
                      </span>
                      <button
                        onClick={() => alert(`Tracking status for ${ord.id}: Package in transit and on schedule.`)}
                        className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
                      >
                        Track Order Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
                Personal Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">First Name</label>
                  <input
                    type="text"
                    readOnly
                    value={userEmail ? userEmail.split("@")[0] : "Customer"}
                    className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-semibold border border-gray-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Last Name</label>
                  <input
                    type="text"
                    readOnly
                    value="Member"
                    className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-semibold border border-gray-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500">Email / Mobile Identity</label>
                  <input
                    type="text"
                    readOnly
                    value={displayName}
                    className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-semibold border border-gray-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
                Saved Delivery Addresses
              </h3>

              <div className="border border-gray-150 dark:border-zinc-800 rounded-xl p-4 bg-slate-50/50 dark:bg-zinc-850/40 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-amber-950/40 text-blue-700 dark:text-amber-400 uppercase rounded">
                    Home (Default)
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {userEmail ? userEmail.split("@")[0] : "Customer"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  #102, Embassy Tech Village, Outer Ring Road, Devarabeesanahalli,<br />
                  Bengaluru, Karnataka - 560103. Phone: +91 98765 43210
                </p>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4">
                AdrsMart Wallet & Gift Cards
              </h3>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-zinc-800 dark:to-zinc-850 p-6 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div>
                  <span className="text-xs font-bold text-blue-200 dark:text-zinc-400 uppercase tracking-widest block">
                    Available Balance
                  </span>
                  <h2 className="text-3xl font-black mt-1">₹1,250.00</h2>
                  <p className="text-[10px] text-blue-100 dark:text-zinc-500 mt-2">
                    ✦ Instant 1-click checkout enabled
                  </p>
                </div>
                <button
                  onClick={() => alert("Gift voucher added to wallet simulation.")}
                  className="px-4 py-2 bg-yellow-400 text-blue-900 dark:bg-amber-500 dark:text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-yellow-300"
                >
                  + Add Gift Card
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AccountDashboardPage;
