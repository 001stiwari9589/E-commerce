/**
 * Silent Background Notification Service for ST Mart Owner
 * Target Owner WhatsApp Number: 9589018011 (+91-9589018011)
 * Sends instant silent alerts for:
 * 1. VIP Offer Coupon Email Subscription
 * 2. New Order Placement
 * 3. Account Signup / Registration
 * 4. User Login
 *
 * NOTE: DOES NOT OPEN ANY NEW BROWSER TAB OR REDIRECT THE USER.
 * All alerts are dispatched silently in the background!
 */

import { API_BASE_URL } from "./api.js";

const OWNER_WHATSAPP_NUMBER = "919589018011";

/**
 * Helper to dispatch alert silently to backend without opening any new browser tab
 */
export const sendSilentNotification = async (eventType, formattedMessage, payloadDetails = {}, overrideNumber = null) => {
  const targetNumber = overrideNumber || OWNER_WHATSAPP_NUMBER;
  try {
    // Dispatch to backend API silently
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
 * 1. Send Notification for New Account Signup (Silent Background)
 */
export const notifySignupWhatsApp = (userData) => {
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
};

/**
 * 2. Send Notification for User Login (Silent Background)
 */
export const notifyLoginWhatsApp = (emailOrPhone) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const text = `🔑 *USER LOGIN ALERT - ST MART* 🔑\n\n` +
    `👤 *User Identifier:* ${emailOrPhone}\n` +
    `⏰ *Time:* ${time}\n` +
    `✅ *Status:* Logged in to ST Mart Mobile/Web App`;

  sendSilentNotification("USER_LOGIN", text, { emailOrPhone });
};

/**
 * 3. Send Notification for New Order Booked (Silent Background)
 */
export const notifyOrderBookedWhatsApp = (orderData) => {
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
};

/**
 * 4. Send Notification for VIP Coupon / Email Offer Subscription (Silent Background)
 */
export const notifyOfferSubscriptionWhatsApp = (emailOrPhone, couponCode = "STMART500") => {
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
};
