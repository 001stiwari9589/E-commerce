/**
 * Email Notification Service for ST Mart Store Owner
 * Target Owner Email: 001stiwari9589@gmail.com
 * Dispatches real-time alerts for:
 * 1. Product Added to Cart (Add to Cart action)
 * 2. Order Booked / Bought (Checkout & Payment confirmation)
 */

import { API_BASE_URL } from "./api";

export const OWNER_EMAIL = "001stiwari9589@gmail.com";

/**
 * Helper to dispatch email notification via:
 * 1. FormSubmit AJAX direct delivery to 001stiwari9589@gmail.com (100% reliable client-side)
 * 2. Backend /api/notify-owner-email (Nodemailer server-side fallback)
 */
async function sendEmailAlert({ subject, data, messageText }) {
  // 1. Client-side FormSubmit AJAX (Delivers directly to 001stiwari9589@gmail.com)
  try {
    fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        ...data,
        Formatted_Summary: messageText,
        Alert_Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }),
    }).catch((e) => console.warn("FormSubmit notice:", e.message));
  } catch (err) {
    console.warn("Client email dispatch notice:", err);
  }

  // 2. Backend API fallback
  try {
    fetch(`${API_BASE_URL}/notify-owner-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetEmail: OWNER_EMAIL,
        subject,
        details: data,
        message: messageText,
      }),
    }).catch(() => {});
  } catch (err) {
    // Silent catch
  }
}

/**
 * 1. Notify Owner when a user adds a product to the cart
 */
export const notifyAddToCartEmail = ({ product, userEmail, currentCartCount = 1 }) => {
  if (!product) return;

  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const customer = userEmail || "Guest User (Not logged in)";

  const subject = `🛒 [ST MART CART ALERT] Item Added to Cart: ${product.name.slice(0, 40)}`;

  const summary =
    `🛒 NEW ITEM ADDED TO CART - ST MART\n` +
    `====================================\n` +
    `👤 Customer: ${customer}\n` +
    `📦 Product: ${product.name}\n` +
    `🆔 Product ID: ${product.id}\n` +
    `💰 Price: ₹${Number(product.price || 0).toLocaleString("en-IN")}\n` +
    `🏷️ Category: ${product.category || "General"}\n` +
    `🛍️ Total Items in Cart: ${currentCartCount}\n` +
    `⏰ Time: ${time}\n` +
    `====================================`;

  const payload = {
    Event_Type: "PRODUCT_ADDED_TO_CART",
    Customer_Email: customer,
    Product_Name: product.name,
    Product_ID: String(product.id),
    Product_Price: `₹${Number(product.price || 0).toLocaleString("en-IN")}`,
    Product_Category: product.category || "General",
    Cart_Count: currentCartCount,
  };

  sendEmailAlert({ subject, data: payload, messageText: summary });
};

/**
 * 2. Notify Owner when a user books/buys an order
 */
export const notifyOrderBookedEmail = (orderData) => {
  if (!orderData) return;

  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const addr = orderData.shippingAddress || {};
  const fullAddress = `${addr.streetAddress || ""}, ${addr.area || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`;

  let itemsList = "";
  if (Array.isArray(orderData.items)) {
    itemsList = orderData.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name} (Qty: ${it.qty || 1}) - ₹${((it.price || 0) * (it.qty || 1)).toLocaleString("en-IN")}`
      )
      .join("\n");
  }

  const subject = `🎉 [NEW ORDER BOOKED] #${orderData.id} - ₹${Number(orderData.totalAmount || 0).toLocaleString("en-IN")} from ${addr.fullName || "Customer"}`;

  const summary =
    `🎉 NEW ORDER BOOKED ON ST MART! 🎉\n` +
    `====================================\n` +
    `📋 Order ID: ${orderData.id}\n` +
    `📄 Invoice No: ${orderData.invoiceNo || "N/A"}\n` +
    `💰 Total Amount: ₹${Number(orderData.totalAmount || 0).toLocaleString("en-IN")}\n` +
    `💳 Payment Method: ${orderData.paymentMethod || "UPI / Online"}\n` +
    `🔑 Transaction / UTR: ${orderData.transactionId || "N/A"}\n\n` +
    `👤 CUSTOMER DETAILS:\n` +
    `• Name: ${addr.fullName || "Customer"}\n` +
    `• Phone: +91 ${addr.phone || "N/A"}\n` +
    `• Account Email: ${orderData.userEmail || "guest@stmart.com"}\n` +
    `• Delivery Address: ${fullAddress}\n` +
    `• Address Type: ${addr.addressType || "Home"}\n\n` +
    `🛒 ORDER ITEMS:\n${itemsList}\n\n` +
    `⏰ Date & Time: ${time}\n` +
    `🚀 Status: CONFIRMED / PAID\n` +
    `====================================`;

  const payload = {
    Event_Type: "NEW_ORDER_BOOKED",
    Order_ID: orderData.id,
    Invoice_Number: orderData.invoiceNo || "N/A",
    Total_Amount: `₹${Number(orderData.totalAmount || 0).toLocaleString("en-IN")}`,
    Payment_Method: orderData.paymentMethod || "UPI / Online",
    Transaction_UTR: orderData.transactionId || "N/A",
    Customer_Name: addr.fullName || "Customer",
    Customer_Phone: `+91 ${addr.phone || "N/A"}`,
    Customer_Account: orderData.userEmail || "guest@stmart.com",
    Delivery_Address: fullAddress,
    Items_Summary: itemsList,
  };

  sendEmailAlert({ subject, data: payload, messageText: summary });
};
