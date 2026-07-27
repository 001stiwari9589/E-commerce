import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const INDIAN_BANKS = [
  { id: "sbi", name: "State Bank of India (SBI)", code: "SBIN" },
  { id: "hdfc", name: "HDFC Bank", code: "HDFC" },
  { id: "icici", name: "ICICI Bank", code: "ICIC" },
  { id: "axis", name: "Axis Bank", code: "UTIB" },
  { id: "kotak", name: "Kotak Mahindra Bank", code: "KKBK" },
  { id: "pnb", name: "Punjab National Bank (PNB)", code: "PUNB" },
  { id: "bob", name: "Bank of Baroda", code: "BARB" },
  { id: "canara", name: "Canara Bank", code: "CNRB" },
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "bg-blue-600", icon: "G" },
  { id: "phonepe", name: "PhonePe", color: "bg-purple-600", icon: "P" },
  { id: "paytm", name: "Paytm UPI", color: "bg-cyan-600", icon: "Paytm" },
  { id: "bhim", name: "BHIM UPI", color: "bg-amber-600", icon: "BHIM" },
];

function CheckoutModal({ isOpen, onClose, cartItems, userEmail, onOrderSuccess, triggerToast }) {
  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment Selector
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "Delhi",
    pincode: "",
    addressType: "Home",
  });

  // Payment State
  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' | 'netbanking' | 'card' | 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    holderName: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-fill default user email/name if available
      if (userEmail && !address.fullName) {
        const namePart = userEmail.split("@")[0];
        setAddress((prev) => ({
          ...prev,
          fullName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        }));
      }
    } else {
      document.body.style.overflow = "unset";
      setStep(1);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const totalOriginalPrice = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalCurrentPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalDiscount = totalOriginalPrice - totalCurrentPrice;
  const deliveryCharge = totalCurrentPrice > 500 || totalCurrentPrice === 0 ? 0 : 40;
  const finalPrice = totalCurrentPrice + deliveryCharge;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.streetAddress || !address.city || !address.pincode) {
      if (triggerToast) triggerToast("Please complete all shipping address fields.", "warning");
      return;
    }
    setStep(2);
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);

    let methodLabel = "Cash on Delivery";
    if (paymentMode === "upi") {
      const appObj = UPI_APPS.find((a) => a.id === selectedUpiApp);
      methodLabel = `UPI (${appObj?.name || "UPI"}${upiId ? ` - ${upiId}` : ""})`;
    } else if (paymentMode === "netbanking") {
      const bankObj = INDIAN_BANKS.find((b) => b.id === selectedBank);
      methodLabel = `Net Banking (${bankObj?.name || "Bank"})`;
    } else if (paymentMode === "card") {
      methodLabel = `Credit/Debit Card (**** ${cardDetails.cardNumber.slice(-4) || "4242"})`;
    }

    // Simulate Payment Gateway Authorization Delay
    setTimeout(async () => {
      const orderPayload = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        invoiceNo: `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        userEmail: userEmail || "guest@stmart.com",
        items: cartItems,
        shippingAddress: address,
        paymentMethod: methodLabel,
        paymentMode: paymentMode.toUpperCase(),
        transactionId: `TXN${Date.now()}${Math.floor(10 + Math.random() * 90)}`,
        totalAmount: finalPrice,
        deliveryCharge,
        status: "Placed",
      };

      // Call API
      const result = await apiService.createOrder(orderPayload);
      setIsProcessingPayment(false);

      if (triggerToast) {
        triggerToast(`Payment Authorized! Order ${orderPayload.id} Confirmed. 🎉`, "success");
      }

      onOrderSuccess(result?.order || orderPayload);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-slate-800 dark:text-zinc-150 border border-gray-150 dark:border-zinc-800">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-850 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
              {step}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {step === 1 ? "Order Checkout: Shipping Address" : "Select Payment Gateway & Confirm"}
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-400">
                {step === 1 ? "Step 1 of 2: Shipping details" : "Step 2 of 2: UPI / Net Banking / Card Payment"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payment Processing Overlay */}
        {isProcessingPayment && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-zinc-900/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 text-xs">
                ST MART
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Processing Payment with Bank...
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-xs">
              Please do not close or refresh this page. Securing your transaction with 256-bit Encryption.
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          
          {step === 1 ? (
            /* STEP 1: ADDRESS FORM */
            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Form Fields */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Shipping Details (डिलीवरी विवरण)
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digit mobile"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 110001"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                      Flat, House No., Building, Street *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Block B, Green Park"
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. New Delhi"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                      Address Type
                    </label>
                    <div className="flex gap-4">
                      {["Home", "Work / Office"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                          <input
                            type="radio"
                            name="addressType"
                            checked={address.addressType === type}
                            onChange={() => setAddress({ ...address, addressType: type })}
                            className="accent-blue-600"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Items & Price Summary */}
                <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                      Items in Order ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </h3>

                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs border-b border-gray-200/50 dark:border-zinc-750 pb-2">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <img src={item.image} alt={item.name} className="w-9 h-9 object-contain rounded bg-white p-0.5" />
                            <div className="truncate">
                              <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400">Qty: {item.qty}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white shrink-0">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-gray-200 dark:border-zinc-700 pt-3 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                        <span>Items Price</span>
                        <span>₹{totalOriginalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Discount</span>
                          <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                        <span>Delivery Charge</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                        </span>
                      </div>
                      <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 my-1"></div>
                      <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white">
                        <span>Total Payable</span>
                        <span className="text-blue-600 dark:text-amber-500 font-extrabold text-base">
                          ₹{finalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-xs uppercase tracking-wider transform active:scale-98"
                  >
                    Proceed to Payment Options &rarr;
                  </button>
                </div>

              </div>

            </form>
          ) : (
            /* STEP 2: PAYMENT GATEWAY SELECTOR */
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
                >
                  &larr; Back to Address
                </button>
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  Total Amount to Pay: <strong className="text-slate-900 dark:text-white">₹{finalPrice.toLocaleString("en-IN")}</strong>
                </span>
              </div>

              {/* Payment Mode Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "upi", label: "UPI Apps & QR", icon: "📱" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  { id: "card", label: "Debit / Credit Card", icon: "💳" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPaymentMode(mode.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMode === mode.id
                        ? "border-blue-600 dark:border-amber-500 bg-blue-50/50 dark:bg-amber-950/20 text-blue-700 dark:text-amber-400 font-extrabold shadow-sm"
                        : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span className="text-xs font-bold">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Mode Body */}
              <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800">
                
                {paymentMode === "upi" && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Select Instant UPI Payment
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            selectedUpiApp === app.id
                              ? "border-blue-600 bg-blue-600 text-white font-bold"
                              : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="text-xs font-black">{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 pt-3 border-t border-gray-200 dark:border-zinc-750 flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center shrink-0">
                        {/* Dynamic QR Code Simulation */}
                        <div className="w-24 h-24 bg-zinc-900 rounded flex flex-col items-center justify-center text-white p-1 text-center">
                          <span className="text-[10px] font-mono">SCAN TO PAY</span>
                          <span className="text-lg font-black text-amber-400">₹{finalPrice}</span>
                          <span className="text-[8px] opacity-70">ST MART UPI</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-1">Scan with any UPI App</span>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Or Enter UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. mobileNumber@upi or username@okaxis"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                          Payment link will be requested directly on your selected UPI app.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMode === "netbanking" && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Select Popular Indian Bank (नेट बैंकिंग)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {INDIAN_BANKS.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedBank === bank.id
                              ? "border-blue-600 bg-blue-600 text-white font-bold"
                              : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="text-xs font-bold">{bank.name}</span>
                          <span className="text-[10px] opacity-70 font-mono">[{bank.code}]</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMode === "card" && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Credit or Debit Card Details
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="4532 0192 8492 1092"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="***"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMode === "cod" && (
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 text-2xl font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Cash on Delivery Available
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Pay cash or UPI at your doorstep upon package delivery.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Process Order & Payment Button */}
              <button
                onClick={handleProcessPayment}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer text-sm uppercase tracking-wider transform active:scale-98 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6a4.5 4.5 0 10-9 0v4.5m3 4.5h6m-6 3h6m-9-7.5h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18V12a1.5 1.5 0 011.5-1.5z" />
                </svg>
                Pay ₹{finalPrice.toLocaleString("en-IN")} &amp; Confirm Order
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default CheckoutModal;
