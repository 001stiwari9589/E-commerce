import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { validatePincode, lookupPincode } from "../services/pincodeService";
import { getPaymentConfig, generateUpiUrl, getUpiQrCodeUrl } from "../config/paymentConfig";
import MerchantPaymentSettingsModal from "./MerchantPaymentSettingsModal";

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
  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' | 'netbanking' | 'card' | 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(() => getPaymentConfig());
  const [isMerchantSettingsOpen, setIsMerchantSettingsOpen] = useState(false);
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
    } else {
      document.body.style.overflow = "unset";
      setStep(1);
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
  const finalPrice = totalCurrentPrice + deliveryCharge;

  // Handle PIN Code Change & Live Lookup
  const handlePincodeChange = async (val) => {
    // Only allow digits up to 6 characters
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);

    setAddress((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 0) {
      setPincodeState({ isLoading: false, error: "", successMsg: "", postOffices: [] });
      return;
    }

    // Check partial validation
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

    // 6-digit complete PIN code entered -> trigger lookup
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

    // Full name validation check (must be a valid full name with at least 2 letters, no emails/phone numbers)
    const cleanName = (address.fullName || "").trim();
    if (!cleanName || cleanName.length < 2) {
      if (triggerToast) triggerToast("Please enter a valid Full Name (at least 2 letters).", "error");
      return;
    }

    if (/\d/.test(cleanName) || cleanName.includes("@")) {
      if (triggerToast) triggerToast("Full Name cannot contain numbers or email addresses.", "error");
      return;
    }

    // Mobile number validation (must be exactly 10 digits)
    const cleanPhone = (address.phone || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      if (triggerToast) triggerToast("Mobile Number must be a valid 10-digit number.", "error");
      return;
    }

    // Pincode validation check
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

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);

    let methodLabel = "Cash on Delivery";
    if (paymentMode === "upi") {
      const appObj = UPI_APPS.find((a) => a.id === selectedUpiApp);
      methodLabel = `UPI Direct (${appObj?.name || "UPI"}${paymentConfig.merchantUpiId ? ` to ${paymentConfig.merchantUpiId}` : ""}${utrNumber ? ` | Ref: ${utrNumber}` : ""})`;
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
                {step === 1 ? "Order Checkout: Shipping Address" : "Select Payment Gateway & Confirm"}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {step === 1 ? "Step 1 of 2: Shipping details" : "Step 2 of 2: UPI / Net Banking / Card Payment"}
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
              Processing Payment with Bank...
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mt-2 max-w-xs">
              Please do not close or refresh this page. Securing your transaction with 256-bit Encryption.
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
                        <span className="text-[10px] text-slate-400 font-semibold">(10 digits only)</span>
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
                        <span>Pincode (PIN code) *</span>
                        {/* <span className="text-[10px] text-blue-600 dark:text-amber-400 font-bold"></span> */}
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

                  {/* Pincode Lookup Feedback Badge */}
                  {pincodeState.isLoading && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Finding area & location details for PIN {address.pincode}...
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

                  {/* Area / Locality Selection if multiple post offices found */}
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

                {/* Right Column: Order Items & Price Summary */}
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
            /* STEP 2: PAYMENT GATEWAY SELECTOR */
            <div className="flex flex-col gap-6">

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
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${paymentMode === mode.id
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
              <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800">

                {paymentMode === "upi" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>📱</span> Instant Direct Bank UPI Payment
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
                          if (triggerToast) triggerToast("UPI ID Copied to Clipboard!", "success");
                          setTimeout(() => setCopiedUpi(false), 2500);
                        }}
                        className="self-stretch sm:self-auto bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
                      >
                        {copiedUpi ? "✓ Copied!" : "📋 Copy UPI ID"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${selectedUpiApp === app.id
                            ? "border-emerald-600 bg-emerald-600 text-white font-extrabold shadow-sm"
                            : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-200 hover:border-emerald-400"
                            }`}
                        >
                          <span className="text-xs font-black">{app.name}</span>
                        </button>
                      ))}
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
                          <span className="text-[10px] font-bold text-slate-500 block">Works with GPay, PhonePe, Paytm, BHIM</span>
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        {/* Direct Mobile Deep Link */}
                        <a
                          href={generateUpiUrl({
                            upiId: paymentConfig.merchantUpiId,
                            name: paymentConfig.merchantName,
                            amount: finalPrice,
                            orderId: `STM-${Date.now().toString().slice(-5)}`,
                          })}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📲</span> Open directly in Mobile UPI App
                        </a>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                            Your UPI ID (VPA)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. mobileNumber@upi or username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1 flex items-center justify-between">
                            <span>UTR / Transaction Ref No. (12 Digits)</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">Instant Receipt</span>
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 329104829104 (From UPI receipt)"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMode === "netbanking" && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Select Popular Indian Bank (Net Banking)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {INDIAN_BANKS.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedBank === bank.id
                            ? "border-blue-600 bg-blue-600 text-white font-extrabold"
                            : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-200 hover:border-blue-300"
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
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Credit or Debit Card Details
                    </h4>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="4532 0192 8492 1092"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 dark:text-zinc-100 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="***"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
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
                        Cash on Delivery Available
                      </h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                        Pay cash or UPI at your doorstep upon package delivery.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Process Order & Payment Button */}
              <button
                onClick={handleProcessPayment}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer text-sm uppercase tracking-wider transform active:scale-98 flex items-center justify-center gap-2"
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
