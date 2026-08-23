/**
 * Notification Service for ST Mart Owner & Customers
 * Target Owner WhatsApp Number: 9589018011 (+91-9589018011)
 * Opens WhatsApp directly with pre-filled details for:
 * 1. New Order Placement
 * 2. VIP Offer Coupon Email Subscription
 * 3. Account Signup / Registration
 * 4. User Login
 */

import { API_BASE_URL } from "./api.js";

export const OWNER_WHATSAPP_NUMBER = "919589018011";

/**
 * Helper to dispatch alert silently to backend
 */
export const sendSilentNotification = async (eventType, formattedMessage, payloadDetails = {}, overrideNumber = null) => {
  const targetNumber = overrideNumber || OWNER_WHATSAPP_NUMBER;
  try {
    await fetch(`${API_BASE_URL}/notify-whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: eventType,
        message: formattedMessage,
        details: payloadDetails,
        targetNumber: targetNumber,
      }),
    });
  } catch (err) {
    console.warn("Silent notification logger notice:", err);
  }
};

/**
 * 1. Generate Direct WhatsApp Message Link for an Order
 */
export const getWhatsappOrderUrl = (orderData) => {
  if (!orderData) return `https://wa.me/${OWNER_WHATSAPP_NUMBER}`;

  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  let itemDetails = "";
  if (Array.isArray(orderData.items)) {
    itemDetails = orderData.items
      .map((item, idx) => `${idx + 1}. ${item.name} (x${item.qty || 1}) - ₹${((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}`)
      .join("\n");
  }

  const addr = orderData.shippingAddress || {};
  const fullAddress = `${addr.streetAddress || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`;

  const text = `🛍️ *NEW ORDER BOOKED - ST MART* 🛍️\n\n` +
    `📋 *Order ID:* ${orderData.id || orderData.orderId}\n` +
    `📄 *Invoice No:* ${orderData.invoiceNo || "N/A"}\n` +
    `💰 *Total Amount:* ₹${Number(orderData.totalAmount || 0).toLocaleString("en-IN")}\n\n` +
    `👤 *Customer Details:*\n` +
    `• *Name:* ${addr.fullName || "Customer"}\n` +
    `• *Phone:* ${addr.phone || "N/A"}\n` +
    `• *Address:* ${fullAddress}\n\n` +
    `🛒 *Items Ordered:*\n${itemDetails}\n\n` +
    `💳 *Payment Method:* ${orderData.paymentMethod || "COD"}\n` +
    `⏰ *Date:* ${time}\n\n` +
    `🚀 *Status:* ORDER CONFIRMED!`;

  return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

/**
 * 2. Send Notification for New Order Booked (Opens WhatsApp Direct)
 */
export const notifyOrderBookedWhatsApp = (orderData, openDirect = true) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  let itemDetails = "";
  if (Array.isArray(orderData.items)) {
    itemDetails = orderData.items
      .map((item, idx) => `${idx + 1}. ${item.name} (x${item.qty || 1}) - ₹${((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}`)
      .join("\n");
  }

  const addr = orderData.shippingAddress || {};
  const fullAddress = `${addr.streetAddress || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`;

  const text = `🛍️ *NEW ORDER BOOKED - ST MART* 🛍️\n\n` +
    `📋 *Order ID:* ${orderData.id || orderData.orderId}\n` +
    `📄 *Invoice No:* ${orderData.invoiceNo || "N/A"}\n` +
    `💰 *Total Amount:* ₹${Number(orderData.totalAmount || 0).toLocaleString("en-IN")}\n\n` +
    `👤 *Customer Details:*\n` +
    `• *Name:* ${addr.fullName || "Customer"}\n` +
    `• *Phone:* ${addr.phone || "N/A"}\n` +
    `• *Address:* ${fullAddress}\n\n` +
    `🛒 *Items Ordered:*\n${itemDetails}\n\n` +
    `💳 *Payment Method:* ${orderData.paymentMethod || "COD"}\n` +
    `⏰ *Date:* ${time}\n\n` +
    `🚀 *Status:* ORDER CONFIRMED!`;

  sendSilentNotification("ORDER_BOOKED", text, orderData);

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  if (openDirect) {
    try {
      window.open(whatsappUrl, "_blank");
    } catch {
      window.location.href = whatsappUrl;
    }
  }

  return whatsappUrl;
};

/**
 * 3. Send Notification for New Account Signup (Opens WhatsApp Direct)
 */
export const notifySignupWhatsApp = (userData, openDirect = true) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const name = userData.name || userData.fullName || "New Customer";
  const phone = userData.phone || "N/A";
  const email = userData.email || userData.emailOrPhone || "N/A";

  const text = `🚨 *NEW USER REGISTRATION - ST MART* 🚨\n\n` +
    `👤 *User Details:*\n` +
    `• *Name:* ${name}\n` +
    `• *Phone:* ${phone}\n` +
    `• *Email:* ${email}\n\n` +
    `⏰ *Timestamp:* ${time}\n` +
    `🚀 *Status:* Account Created Successfully!`;

  sendSilentNotification("USER_SIGNUP", text, { name, phone, email });

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  if (openDirect) {
    try { window.open(whatsappUrl, "_blank"); } catch { window.location.href = whatsappUrl; }
  }
  return whatsappUrl;
};

/**
 * 4. Send Notification for User Login
 */
export const notifyLoginWhatsApp = (emailOrPhone, openDirect = false) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const text = `🔑 *USER LOGIN ALERT - ST MART* 🔑\n\n` +
    `👤 *User Identifier:* ${emailOrPhone}\n` +
    `⏰ *Time:* ${time}\n` +
    `✅ *Status:* Logged in to ST Mart Mobile/Web App`;

  sendSilentNotification("USER_LOGIN", text, { emailOrPhone });

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  if (openDirect) {
    try { window.open(whatsappUrl, "_blank"); } catch { window.location.href = whatsappUrl; }
  }
  return whatsappUrl;
};

/**
 * 5. Send Notification for VIP Coupon / Email Offer Subscription (Opens WhatsApp Direct)
 */
export const notifyOfferSubscriptionWhatsApp = (emailOrPhone, couponCode = "STMART500", openDirectWhatsapp = true) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const cleanInput = (emailOrPhone || "").trim();
  const digits = cleanInput.replace(/\D/g, "");
  const isPhone = digits.length === 10;
  const targetNum = isPhone ? digits : OWNER_WHATSAPP_NUMBER;

  const text = `🎁 *NEW VIP OFFER / COUPON CLAIM - ST MART* 🎁\n\n` +
    `📧 *User Contact:* ${cleanInput}\n` +
    `🎟️ *Coupon Code Claimed:* ${couponCode} (₹500 OFF)\n` +
    `⏰ *Time:* ${time}\n` +
    `🌟 *Status:* STMART500 Discount Code Active!`;

  sendSilentNotification("COUPON_EMAIL_CLAIM", text, { emailOrPhone: cleanInput, couponCode }, targetNum);

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  if (openDirectWhatsapp) {
    try {
      window.open(whatsappUrl, "_blank");
    } catch {
      window.location.href = whatsappUrl;
    }
  }

  return whatsappUrl;
};

/**
 * 6. Send Notification for Contact Us Form Submission (Direct WhatsApp Launch)
 */
export const notifyContactWhatsApp = (contactData) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const text = `📩 *NEW CONTACT US MESSAGE - ST MART* 📩\n\n` +
    `👤 *Customer Name:* ${contactData.name}\n` +
    `📞 *Phone:* ${contactData.phone || "N/A"}\n` +
    `📧 *Email:* ${contactData.email}\n` +
    `📌 *Subject:* ${contactData.subject}\n\n` +
    `💬 *Message Details:*\n${contactData.message}\n\n` +
    `⏰ *Date & Time:* ${time}\n` +
    `🚀 *Status:* Support Inquiry Received!`;

  sendSilentNotification("CONTACT_MESSAGE", text, contactData);

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  try {
    window.open(whatsappUrl, "_blank");
  } catch {
    window.location.href = whatsappUrl;
  }

  return whatsappUrl;
};
