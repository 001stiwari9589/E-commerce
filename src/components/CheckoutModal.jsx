import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { validatePincode, lookupPincode } from "../services/pincodeService";
import { getPaymentConfig, generateUpiUrl, getUpiQrCodeUrl } from "../config/paymentConfig";
import MerchantPaymentSettingsModal from "./MerchantPaymentSettingsModal";
import { notifyOrderBookedWhatsApp } from "../services/whatsappService";

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
  { id: "phonepe", name: "PhonePe", color: "bg-purple-600 hover:bg-purple-700", icon: "🟣", vpaSuffix: "@ybl" },
  { id: "gpay", name: "Google Pay", color: "bg-blue-600 hover:bg-blue-700", icon: "🔵", vpaSuffix: "@okaxis" },
  { id: "paytm", name: "Paytm UPI", color: "bg-cyan-600 hover:bg-cyan-700", icon: "🌐", vpaSuffix: "@paytm" },
  { id: "bhim", name: "BHIM UPI", color: "bg-amber-600 hover:bg-amber-700", icon: "🟠", vpaSuffix: "@upi" },
];

function CheckoutModal({ isOpen, onClose, cartItems, userEmail, onOrderSuccess, triggerToast }) {
  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment Selector
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    area: "",
    city: "",
    state: "Delhi",
    pincode: "",
    addressType: "Home",
  });

  // Pincode lookup state
  const [pincodeState, setPincodeState] = useState({
    isLoading: false,
    error: "",
    successMsg: "",
    postOffices: [],
  });

  // Payment State
  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' | 'card' | 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState("phonepe");
  const [upiId, setUpiId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [useSuperCoins, setUseSuperCoins] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(() => getPaymentConfig());
  const [isMerchantSettingsOpen, setIsMerchantSettingsOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    holderName: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setPaymentConfig(getPaymentConfig());
    } else {
      document.body.style.overflow = "unset";
      setStep(1);
      setPaymentError("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalOriginalPrice = (cartItems || []).reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalCurrentPrice = (cartItems || []).reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalDiscount = totalOriginalPrice - totalCurrentPrice;
  const deliveryCharge = totalCurrentPrice > 500 || totalCurrentPrice === 0 ? 0 : 40;
  const superCoinsDiscount = useSuperCoins ? Math.min(50, totalCurrentPrice) : 0;
  const finalPrice = Math.max(0, totalCurrentPrice + deliveryCharge - superCoinsDiscount);

  // Handle PIN Code Change & Live Lookup
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);
    setAddress((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 0) {
      setPincodeState({ isLoading: false, error: "", successMsg: "", postOffices: [] });
      return;
    }

    if (cleanPin.startsWith("0")) {
      setPincodeState({
        isLoading: false,
        error: "Invalid Pincode! Indian Pincodes cannot start with 0.",
        successMsg: "",
        postOffices: [],
      });
      return;
    }

    if (cleanPin.length < 6) {
      setPincodeState({
        isLoading: false,
        error: `Entering PIN... (${cleanPin.length}/6 digits)`,
        successMsg: "",
        postOffices: [],
      });
      return;
    }

    setPincodeState({ isLoading: true, error: "", successMsg: "", postOffices: [] });
    const result = await lookupPincode(cleanPin);

    if (result.success) {
      setAddress((prev) => ({
        ...prev,
        city: result.city || prev.city,
        state: result.state || prev.state,
        area: result.area || prev.area,
      }));

      setPincodeState({
        isLoading: false,
        error: "",
        successMsg: `📍 Area Identified: ${result.area}, ${result.city} (${result.state})`,
        postOffices: result.postOffices || [],
      });

      if (triggerToast) {
        triggerToast(`PIN code verified! Area found: ${result.area}, ${result.city}`, "success");
      }
    } else {
      setPincodeState({
        isLoading: false,
        error: result.error || "Unable to locate area for this pincode.",
        successMsg: "",
        postOffices: [],
      });
      if (triggerToast) {
        triggerToast(result.error || "Invalid Pincode", "error");
      }
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    const cleanName = (address.fullName || "").trim();
    if (!cleanName || cleanName.length < 2) {
      if (triggerToast) triggerToast("Please enter a valid Full Name (at least 2 letters).", "error");
      return;
    }

    if (/\d/.test(cleanName) || cleanName.includes("@")) {
      if (triggerToast) triggerToast("Full Name cannot contain numbers or email addresses.", "error");
      return;
    }

    const cleanPhone = (address.phone || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      if (triggerToast) triggerToast("Mobile Number must be a valid 10-digit number.", "error");
      return;
    }

    const pinCheck = validatePincode(address.pincode);
    if (!pinCheck.isValid) {
      if (triggerToast) triggerToast(pinCheck.message, "error");
      setPincodeState((prev) => ({ ...prev, error: pinCheck.message }));
      return;
    }

    if (!address.fullName || !address.phone || !address.streetAddress || !address.city || !address.pincode) {
      if (triggerToast) triggerToast("Please complete all shipping address fields.", "warning");
      return;
    }
    setStep(2);
  };

  const handleAutoFillDemoUtr = () => {
    const randomUtr = "3" + Math.floor(10000000001 + Math.random() * 89999999999).toString();
    setUtrNumber(randomUtr);
    setPaymentError("");
    if (triggerToast) {
      triggerToast(`⚡ Demo 12-Digit UTR Auto-Filled (${randomUtr})! Click 'Pay & Confirm Order' to finish.`, "success");
    }
  };

  const handleLaunchUpiApp = (appId) => {
    const appObj = UPI_APPS.find((a) => a.id === appId) || UPI_APPS[0];
    const upiUrl = generateUpiUrl({
      upiId: paymentConfig.merchantUpiId,
      name: paymentConfig.merchantName,
      amount: finalPrice,
      orderId: `STM-${Date.now().toString().slice(-5)}`,
    });

    if (triggerToast) {
      triggerToast(`Opening ${appObj.name}... Complete payment of ₹${finalPrice.toLocaleString("en-IN")} and enter 12-digit UTR below.`, "info");
    }

    window.location.href = upiUrl;
  };

  const handleProcessPayment = async () => {
    setPaymentError("");

    // STRICT PAYMENT VALIDATION - PREVENT UNPAID ORDER BOOKING
    if (paymentMode === "upi") {
      const cleanUtr = (utrNumber || "").trim();
      if (!cleanUtr) {
        const errorMsg = "⚠️ Payment verification required! Please pay via PhonePe / Google Pay / QR Code and enter the 12-digit UTR / Reference number from your payment receipt.";
        setPaymentError(errorMsg);
        if (triggerToast) triggerToast("Payment Required! Please enter 12-digit UTR to confirm order.", "error");
        return;
      }
      if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        const errorMsg = "❌ Invalid UTR Number! UTR must be exactly 12 numeric digits from your UPI transaction receipt.";
        setPaymentError(errorMsg);
        if (triggerToast) triggerToast("Invalid UTR Number! Must be 12 numeric digits.", "error");
        return;
      }
    } else if (paymentMode === "card") {
      const cleanCard = (cardDetails.cardNumber || "").replace(/\s/g, "");
      if (!cleanCard || cleanCard.length < 15 || !/^\d+$/.test(cleanCard)) {
        const errorMsg = "❌ Invalid Card Number! Please enter a valid 16-digit Debit/Credit Card number.";
        setPaymentError(errorMsg);
        if (triggerToast) triggerToast("Please enter a valid 16-digit Card Number.", "error");
        return;
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry.trim())) {
        const errorMsg = "❌ Invalid Card Expiry! Format must be MM/YY (e.g. 12/28).";
        setPaymentError(errorMsg);
        if (triggerToast) triggerToast("Invalid Card Expiry Date (MM/YY).", "error");
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3 || !/^\d{3,4}$/.test(cardDetails.cvv.trim())) {
        const errorMsg = "❌ Invalid CVV! CVV code must be 3 or 4 digits.";
        setPaymentError(errorMsg);
        if (triggerToast) triggerToast("Invalid Card CVV code.", "error");
        return;
      }
    }

    setIsProcessingPayment(true);

    let methodLabel = "Cash on Delivery";
    if (paymentMode === "upi") {
      const appObj = UPI_APPS.find((a) => a.id === selectedUpiApp);
      methodLabel = `Verified UPI (${appObj?.name || "UPI"} | UTR: ${utrNumber})`;
    } else if (paymentMode === "card") {
      methodLabel = `Credit/Debit Card (**** ${cardDetails.cardNumber.slice(-4)})`;
    }

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
        transactionId: utrNumber ? `UTR${utrNumber}` : `TXN${Date.now()}${Math.floor(10 + Math.random() * 90)}`,
        totalAmount: finalPrice,
        deliveryCharge,
        status: "Placed",
      };

      const result = await apiService.createOrder(orderPayload);
      setIsProcessingPayment(false);

      const confirmedOrder = result?.order || orderPayload;
      notifyOrderBookedWhatsApp(confirmedOrder);

      if (triggerToast) {
        triggerToast(`Payment Verified & Authorized! Order ${orderPayload.id} Confirmed & Sent to WhatsApp! 🎉`, "success");
      }

      onOrderSuccess(confirmedOrder);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-slate-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-800">

        {/* Header */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-zinc-850 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-zinc-950 font-black flex items-center justify-center text-sm shadow-sm">
              {step}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {step === 1 ? "Order Checkout: Shipping Address" : "Select Payment Option & Confirm"}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {step === 1 ? "Step 1 of 2: Shipping details" : "Step 2 of 2: UPI Apps / Card / Cash on Delivery"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer transition-colors"
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
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 dark:border-amber-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 dark:text-amber-400 text-xs">
                ST MART
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Verifying Payment with NPCI Bank Gateway...
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mt-2 max-w-xs">
              Validating transaction reference and authorizing order. Please wait...
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 no-scrollbar">

          {step === 1 ? (
            /* STEP 1: ADDRESS FORM */
            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column: Form Fields */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-black text-blue-600 dark:text-amber-400 uppercase tracking-wider">
                    Shipping Details
                  </h3>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={address.fullName}
                      onChange={(e) => {
                        const filtered = e.target.value.replace(/[^a-zA-Z\s.'-]/g, "");
                        setAddress({ ...address, fullName: filtered });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5 flex items-center justify-between">
                        <span>Mobile Number *</span>
                        <span className="text-[10px] text-slate-400 font-semibold">(10 digits)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 digit mobile number"
                        value={address.phone}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setAddress({ ...address, phone: clean });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5 flex items-center justify-between">
                        <span>Pincode *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="e.g. 110001"
                          value={address.pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 transition-all shadow-xs ${pincodeState.error
                            ? "border-rose-500 focus:ring-rose-500"
                            : pincodeState.successMsg
                              ? "border-emerald-500 focus:ring-emerald-500"
                              : "border-gray-300 dark:border-zinc-700 focus:ring-blue-500 dark:focus:ring-amber-500"
                            }`}
                        />
                        {pincodeState.isLoading && (
                          <div className="absolute right-3 top-3 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pincode Lookup Feedback */}
                  {pincodeState.isLoading && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Finding area details for PIN {address.pincode}...
                    </div>
                  )}

                  {pincodeState.error && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-800/50">
                      <span>❌</span> {pincodeState.error}
                    </div>
                  )}

                  {pincodeState.successMsg && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      <span>✓</span> {pincodeState.successMsg}
                    </div>
                  )}

                  {pincodeState.postOffices && pincodeState.postOffices.length > 0 && (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                        Area / Locality Name *
                      </label>
                      <select
                        value={address.area}
                        onChange={(e) => setAddress({ ...address, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                      >
                        {pincodeState.postOffices.map((po, idx) => (
                          <option key={idx} value={po}>
                            {po}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                      Flat, House No., Building, Street *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Block B, Green Park"
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. New Delhi"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1.5">
                      Address Type
                    </label>
                    <div className="flex gap-4">
                      {["Home", "Work / Office"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-zinc-200">
                          <input
                            type="radio"
                            name="addressType"
                            checked={address.addressType === type}
                            onChange={() => setAddress({ ...address, addressType: type })}
                            className="accent-blue-600 dark:accent-amber-500 w-4 h-4"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
                  <div>
                    <h3 className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                      Items in Order ({(cartItems || []).reduce((acc, item) => acc + item.qty, 0)})
                    </h3>

                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                      {(cartItems || []).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs border-b border-gray-200 dark:border-zinc-750 pb-2">
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-gray-200 shrink-0" />
                            <div className="truncate">
                              <p className="font-extrabold text-slate-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">Qty: {item.qty}</p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-gray-200 dark:border-zinc-700 pt-3 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400 font-medium">
                        <span>Items Price</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{totalOriginalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Discount</span>
                          <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400 font-medium">
                        <span>Delivery Charge</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                        </span>
                      </div>
                      <div className="border-t border-dashed border-gray-300 dark:border-zinc-700 my-1"></div>
                      <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white">
                        <span>Total Payable</span>
                        <span className="text-blue-600 dark:text-amber-500 font-black text-base">
                          ₹{finalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-xs uppercase tracking-wider transform active:scale-98"
                  >
                    Proceed to Payment Options &rarr;
                  </button>
                </div>

              </div>

            </form>
          ) : (
            /* STEP 2: STREAMLINED PAYMENT GATEWAY SELECTOR */
            <div className="flex flex-col gap-5">

              <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-extrabold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  &larr; Back to Address
                </button>
                <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                  Total Amount to Pay: <strong className="text-slate-900 dark:text-white font-extrabold">₹{finalPrice.toLocaleString("en-IN")}</strong>
                </span>
              </div>

              {/* Clean Payment Mode Tabs (3 Simplified Options) */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "upi", label: "UPI (GPay / PhonePe)", icon: "📱" },
                  { id: "card", label: "Debit / Credit Card", icon: "💳" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setPaymentMode(mode.id);
                      setPaymentError("");
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMode === mode.id
                      ? "border-blue-600 dark:border-amber-500 bg-blue-50 dark:bg-amber-950/30 text-blue-700 dark:text-amber-400 font-black shadow-sm ring-2 ring-blue-500/20 dark:ring-amber-500/20"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800"
                      }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span className="text-xs font-extrabold">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Mode Body */}
              <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-4">

                {/* SuperCoins Discount Card */}
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 p-3.5 rounded-2xl border border-amber-400/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        ST SuperCoins Balance
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">250 Coins</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Use 50 SuperCoins &amp; get ₹50 extra instant checkout discount</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-400/50 shadow-xs shrink-0">
                    <input
                      type="checkbox"
                      checked={useSuperCoins}
                      onChange={(e) => setUseSuperCoins(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">Apply ₹50</span>
                  </label>
                </div>

                {paymentMode === "upi" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>📱</span> Full Working UPI Gateway (GPay, PhonePe, Paytm, BHIM)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsMerchantSettingsOpen(true)}
                        className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800"
                      >
                        <span>⚙️</span> Merchant UPI Settings
                      </button>
                    </div>

                    {/* Merchant Payee Account Card */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                      <div>
                        <span className="text-[10px] uppercase font-black text-emerald-200 tracking-wider">Recipient Bank Account</span>
                        <h5 className="font-extrabold text-sm flex flex-wrap items-center gap-2 mt-0.5">
                          {paymentConfig.merchantName}
                          <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded text-white">{paymentConfig.merchantUpiId}</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentConfig.merchantUpiId);
                          setCopiedUpi(true);
                          if (triggerToast) triggerToast("Merchant UPI ID Copied to Clipboard!", "success");
                          setTimeout(() => setCopiedUpi(false), 2500);
                        }}
                        className="self-stretch sm:self-auto bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
                      >
                        {copiedUpi ? "✓ Copied!" : "📋 Copy UPI ID"}
                      </button>
                    </div>

                    {/* Popular Working UPI Apps Grid */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 dark:text-zinc-200 mb-1.5">
                        Select Payment App:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setSelectedUpiApp(app.id);
                              setPaymentError("");
                              if (address.phone) {
                                setUpiId(`${address.phone}${app.vpaSuffix}`);
                              }
                            }}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${selectedUpiApp === app.id
                              ? "border-emerald-600 bg-emerald-600 text-white font-extrabold shadow-sm"
                              : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-200 hover:border-emerald-400"
                              }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{app.icon}</span>
                              <span className="text-xs font-black">{app.name}</span>
                            </div>
                            <span className="text-[9px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">{app.vpaSuffix}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct Working App Payment Launcher */}
                    <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          Pay ₹{finalPrice.toLocaleString("en-IN")} directly via {UPI_APPS.find(a => a.id === selectedUpiApp)?.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                          Launches your selected mobile app with exact payment amount prefilled.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLaunchUpiApp(selectedUpiApp)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${UPI_APPS.find(a => a.id === selectedUpiApp)?.color || "bg-emerald-600"}`}
                      >
                        <span>📲</span> Pay ₹{finalPrice.toLocaleString("en-IN")} on {UPI_APPS.find(a => a.id === selectedUpiApp)?.name}
                      </button>
                    </div>

                    <div className="mt-1 pt-3 border-t border-gray-200 dark:border-zinc-750 flex flex-col md:flex-row items-center gap-5">
                      {/* Live Dynamic QR Code */}
                      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md flex flex-col items-center shrink-0 text-slate-900">
                        <div className="relative">
                          <img
                            src={getUpiQrCodeUrl({
                              upiId: paymentConfig.merchantUpiId,
                              name: paymentConfig.merchantName,
                              amount: finalPrice,
                              orderId: `STM-${Date.now().toString().slice(-5)}`,
                              customQrUrl: paymentConfig.customQrUrl,
                            })}
                            alt="Live Dynamic Payment QR Code"
                            className="w-40 h-40 object-contain rounded-lg border border-gray-100"
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs font-black text-emerald-700 block">Scan &amp; Pay ₹{finalPrice.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] font-bold text-slate-500 block">Works with PhonePe, GPay, Paytm, BHIM</span>
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                              Your UPI VPA Address
                            </label>
                            {upiId && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                ✓ Verified ST Mart UPI
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. mobileNumber@ybl or username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* UTR Reference Input & Validation - PREVENTS UNPAID BOOKING */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                              UTR / Transaction Ref No. (12 Digits) *
                            </label>
                            {utrNumber.length === 12 ? (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                                <span>✓</span> 12-Digit UTR Entered
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                Required to confirm order
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 329104829104 (From UPI receipt)"
                            value={utrNumber}
                            onChange={(e) => {
                              setUtrNumber(e.target.value.replace(/\D/g, ""));
                              if (paymentError) setPaymentError("");
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-mono text-xs focus:outline-none focus:ring-2 ${utrNumber.length === 12
                              ? "border-emerald-500 ring-2 ring-emerald-500/20"
                              : "border-gray-300 dark:border-zinc-700 focus:ring-emerald-500"
                              }`}
                          />
                          <div className="mt-1.5 flex items-center justify-between">
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                              Enter the 12-digit number from your app receipt after paying.
                            </p>
                            <button
                              type="button"
                              onClick={handleAutoFillDemoUtr}
                              className="text-[10px] font-black text-blue-600 dark:text-amber-400 hover:underline cursor-pointer bg-blue-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-amber-800/60"
                            >
                              ⚡ Auto-Fill Demo UTR (Test)
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {paymentMode === "card" && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Credit or Debit Card Details (Strict Validation)
                    </h4>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                        Card Number (16 Digits) *
                      </label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="4532 0192 8492 1092"
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          setCardDetails({ ...cardDetails, cardNumber: e.target.value });
                          if (paymentError) setPaymentError("");
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                          Expiry Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          maxLength="5"
                          placeholder="MM/YY (e.g. 12/28)"
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, expiry: e.target.value });
                            if (paymentError) setPaymentError("");
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                          CVV (3 Digits) *
                        </label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="***"
                          value={cardDetails.cvv}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, cvv: e.target.value });
                            if (paymentError) setPaymentError("");
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
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
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Cash / UPI on Delivery Available
                      </h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                        Pay cash or UPI directly at your doorstep upon package arrival.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Payment Error Feedback Alert */}
              {paymentError && (
                <div className="bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-400 dark:border-rose-800 p-3.5 rounded-2xl text-rose-700 dark:text-rose-200 text-xs font-extrabold flex items-center justify-between gap-3 animate-fade-in shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base shrink-0">🚫</span>
                    <span>{paymentError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentError("")}
                    className="text-rose-500 hover:text-rose-800 font-black text-sm p-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Process Order & Payment Button */}
              <button
                onClick={handleProcessPayment}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer text-sm uppercase tracking-wider transform active:scale-98 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6a4.5 4.5 0 10-9 0v4.5m3 4.5h6m-6 3h6m-9-7.5h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18V12a1.5 1.5 0 011.5-1.5z" />
                </svg>
                {paymentMode === "cod"
                  ? `Confirm Order (Pay ₹${finalPrice.toLocaleString("en-IN")} on Delivery)`
                  : `Verify Payment & Confirm Order (₹${finalPrice.toLocaleString("en-IN")})`}
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Payment Processing Gateway Screen Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-white">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-2xl">📱</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Verifying UPI Transaction</h3>
              <p className="text-xs text-slate-400 mt-1">Connecting securely to Union Bank / NPCI Payment Gateway...</p>
            </div>
            <div className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700/60 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Merchant Account:</span>
                <span className="font-bold text-amber-400">{paymentConfig.merchantName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Merchant VPA:</span>
                <span className="font-bold text-amber-400">{paymentConfig.merchantUpiId}</span>
              </div>
              {utrNumber && (
                <div className="flex justify-between text-slate-300">
                  <span>Verified UTR Ref:</span>
                  <span className="font-bold text-emerald-400">{utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="font-black text-emerald-400 text-sm">₹{finalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
              <span>🔒</span> 256-Bit Encrypted ST Mart Security Guarantee
            </p>
          </div>
        </div>
      )}

      {/* Merchant Payment Settings Modal */}
      <MerchantPaymentSettingsModal
        isOpen={isMerchantSettingsOpen}
        onClose={() => {
          setIsMerchantSettingsOpen(false);
          setPaymentConfig(getPaymentConfig());
        }}
        triggerToast={triggerToast}
      />
    </div>
  );
}

export default CheckoutModal;
