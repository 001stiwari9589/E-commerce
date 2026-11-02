import crypto from "crypto";
import mongoose from "mongoose";
import { OtpVerification } from "../models/OtpVerification.js";

const OTP_SECRET = process.env.OTP_SECRET || "smartdeals_otp_salt_secret_9589";
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_FAILED_ATTEMPTS = 5;
const MAX_REQUESTS_IN_WINDOW = 5;
const REQUEST_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// In-memory tracking for rate-limiting (email => [timestamps])
const requestTimestamps = new Map();

// In-memory fallback store if MongoDB is not connected
const inMemoryOtpStore = new Map();

/**
 * Normalizes email address to lowercase and trimmed string.
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Validates standard email address syntax.
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Cryptographically hashes the 6-digit OTP combined with the normalized email and secret salt.
 */
export function hashOtp(email, otp) {
  return crypto
    .createHash("sha256")
    .update(`${email}:${otp}:${OTP_SECRET}`)
    .digest("hex");
}

/**
 * Checks rate limiting for an email:
 * 1. 60-second cooldown between consecutive requests
 * 2. Maximum 5 requests within 10 minutes
 */
export function checkRateLimit(email) {
  const normEmail = normalizeEmail(email);
  const now = Date.now();

  const timestamps = (requestTimestamps.get(normEmail) || []).filter(
    (ts) => now - ts < REQUEST_WINDOW_MS
  );

  if (timestamps.length > 0) {
    const lastRequest = timestamps[timestamps.length - 1];
    const timeSinceLast = now - lastRequest;
    if (timeSinceLast < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLast) / 1000);
      return {
        allowed: false,
        reason: `Please wait ${waitSeconds}s before requesting a new code.`,
        waitSeconds,
      };
    }
  }

  if (timestamps.length >= MAX_REQUESTS_IN_WINDOW) {
    return {
      allowed: false,
      reason: "Too many OTP requests. Please wait 10 minutes before trying again.",
      waitSeconds: 600,
    };
  }

  return { allowed: true };
}

/**
 * Records an OTP request timestamp for rate limiting.
 */
export function recordRequest(email) {
  const normEmail = normalizeEmail(email);
  const now = Date.now();
  const timestamps = (requestTimestamps.get(normEmail) || []).filter(
    (ts) => now - ts < REQUEST_WINDOW_MS
  );
  timestamps.push(now);
  requestTimestamps.set(normEmail, timestamps);
}

/**
 * Generates a real cryptographic 6-digit OTP, hashes it, and saves to MongoDB.
 */
export async function createAndStoreOtp(email) {
  const normEmail = normalizeEmail(email);
  // Generate unpredictable 6-digit integer from 100000 to 999999
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashed = hashOtp(normEmail, otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  recordRequest(normEmail);

  const isMongoConnected = mongoose.connection.readyState === 1;

  if (isMongoConnected) {
    try {
      // Upsert: replace any previous active OTP for this email
      await OtpVerification.findOneAndUpdate(
        { email: normEmail },
        {
          hashedOtp: hashed,
          expiresAt,
          verified: false,
          failedAttempts: 0,
          lastRequestedAt: new Date(),
          createdAt: new Date(),
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    } catch (err) {
      console.warn("⚠️ OtpVerification MongoDB write error, using in-memory store:", err.message);
      inMemoryOtpStore.set(normEmail, { hashedOtp: hashed, expiresAt, failedAttempts: 0 });
    }
  } else {
    inMemoryOtpStore.set(normEmail, { hashedOtp: hashed, expiresAt, failedAttempts: 0 });
  }

  return { otp, expiresAt };
}

/**
 * Verifies user-submitted 6-digit OTP:
 * - Checks existence
 * - Checks 5-minute expiry
 * - Checks max 5 failed attempts
 * - Hashes input and compares
 * - Invalidates OTP upon success (prevents reuse)
 */
export async function verifyUserOtp(email, inputOtp) {
  const normEmail = normalizeEmail(email);
  if (!normEmail || !inputOtp) {
    return { success: false, message: "Email and 6-digit OTP code are required." };
  }

  const cleanOtp = inputOtp.trim();
  if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
    return { success: false, message: "Please enter a valid 6-digit numeric OTP code." };
  }

  const isMongoConnected = mongoose.connection.readyState === 1;
  let record = null;

  if (isMongoConnected) {
    try {
      record = await OtpVerification.findOne({ email: normEmail });
    } catch (err) {
      console.warn("⚠️ OtpVerification read error, checking fallback store:", err.message);
      record = inMemoryOtpStore.get(normEmail);
    }
  } else {
    record = inMemoryOtpStore.get(normEmail);
  }

  if (!record) {
    return {
      success: false,
      message: "No active verification code found for this email. Please request a new OTP.",
    };
  }

  // 1. Check Expiry (5 minutes)
  const now = new Date();
  if (new Date(record.expiresAt) < now) {
    if (isMongoConnected) {
      await OtpVerification.deleteOne({ email: normEmail }).catch(() => {});
    }
    inMemoryOtpStore.delete(normEmail);
    return {
      success: false,
      message: "This OTP has expired (5-minute validity). Please request a new verification code.",
    };
  }

  // 2. Check Failed Attempts Limit (max 5)
  if ((record.failedAttempts || 0) >= MAX_FAILED_ATTEMPTS) {
    if (isMongoConnected) {
      await OtpVerification.deleteOne({ email: normEmail }).catch(() => {});
    }
    inMemoryOtpStore.delete(normEmail);
    return {
      success: false,
      message: "Too many incorrect attempts (max 5). This OTP has been invalidated for security. Please request a new one.",
    };
  }

  // 3. Verify Hash
  const computedHash = hashOtp(normEmail, cleanOtp);
  if (computedHash !== record.hashedOtp) {
    // Increment failed attempts
    const newCount = (record.failedAttempts || 0) + 1;
    if (isMongoConnected) {
      await OtpVerification.updateOne(
        { email: normEmail },
        { $inc: { failedAttempts: 1 } }
      ).catch(() => {});
    } else {
      record.failedAttempts = newCount;
    }

    const remaining = MAX_FAILED_ATTEMPTS - newCount;
    return {
      success: false,
      message: remaining > 0
        ? `Incorrect OTP! You have ${remaining} attempt(s) remaining.`
        : "Incorrect OTP! Maximum attempts exceeded. Code has been invalidated.",
    };
  }

  // 4. Success: Invalidate OTP immediately to prevent reuse
  if (isMongoConnected) {
    await OtpVerification.deleteOne({ email: normEmail }).catch(() => {});
  }
  inMemoryOtpStore.delete(normEmail);

  return {
    success: true,
    message: "Email verified successfully!",
  };
}
