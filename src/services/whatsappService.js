/**
 * WhatsApp Notification Service for ST Mart Owner
 * Target WhatsApp Number: 9589018011 (+91-9589018011)
 * Sends instant formatted WhatsApp alerts for:
 * 1. Account Signup / Registration
 * 2. User Login
 * 3. New Order Placement
 * 4. VIP Offer Coupon Email Subscription
 */

const OWNER_WHATSAPP_NUMBER = "919589018011";

/**
 * Helper to build and open WhatsApp message link
 */
export const openWhatsAppMessage = (textMessage) => {
  const encodedText = encodeURIComponent(textMessage);
  const waUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedText}`;

  try {
    const newWindow = window.open(waUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      window.location.href = waUrl;
    }
  } catch (err) {
    console.warn("WhatsApp popup blocked, redirecting:", err);
    window.location.href = waUrl;
  }
};

/**
 * 1. Send WhatsApp Notification for New Account Signup
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

  openWhatsAppMessage(text);
};

/**
 * 2. Send WhatsApp Notification for User Login
 */
export const notifyLoginWhatsApp = (emailOrPhone) => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const text = `🔑 *USER LOGIN ALERT - ST MART* 🔑\n\n` +
    `👤 *User Identifier:* ${emailOrPhone}\n` +
    `⏰ *Time:* ${time}\n` +
    `✅ *Status:* Logged in to ST Mart Mobile/Web App`;

  openWhatsAppMessage(text);
};

/**
 * 3. Send WhatsApp Notification for New Order Booked
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

  openWhatsAppMessage(text);
};

/**
 * 4. Send WhatsApp Notification for VIP Coupon / Email Offer Subscription
 */
export const notifyOfferSubscriptionWhatsApp = (email, couponCode = "STMART500") => {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const text = `🎁 *NEW VIP OFFER / COUPON CLAIM - ST MART* 🎁\n\n` +
    `📧 *Subscribed Email:* ${email}\n` +
    `🎟️ *Coupon Code Claimed:* ${couponCode} (₹500 OFF)\n` +
    `⏰ *Time:* ${time}\n` +
    `🌟 *Source:* Home Offer Section`;

  openWhatsAppMessage(text);
};
