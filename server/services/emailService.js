import nodemailer from "nodemailer";

/**
 * Generates an attractive, professional HTML template for the 6-digit OTP verification email.
 */
export function generateOtpEmailHtml(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Email Verification Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #1e293b;
    }
    .container {
      max-width: 520px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      padding: 28px 24px;
      text-align: center;
      color: #ffffff;
    }
    .brand {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand span {
      color: #fbbf24;
    }
    .body {
      padding: 32px 28px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .message {
      font-size: 14px;
      color: #475569;
      margin-bottom: 24px;
    }
    .otp-card {
      background: #f0fdf4;
      border: 2px dashed #22c55e;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 800;
      color: #15803d;
      margin-bottom: 8px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 8px;
      margin: 4px 0;
    }
    .otp-expiry {
      font-size: 12px;
      font-weight: 600;
      color: #dc2626;
      margin-top: 8px;
    }
    .warning {
      font-size: 13px;
      color: #64748b;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }
    .footer {
      background: #f8fafc;
      padding: 16px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand">Smart<span>Deals</span>.in</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #93c5fd; font-weight: 600;">Secure Real-Time Verification</p>
    </div>
    <div class="body">
      <div class="greeting">Hello,</div>
      <div class="message">
        Thank you for registering on our website.
      </div>
      
      <div class="otp-card">
        <div class="otp-label">Your email verification OTP is</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱️ This OTP is valid for 5 minutes.</div>
      </div>

      <div class="warning">
        🔒 <strong>Security Notice:</strong> Please do not share this OTP with anyone, including customer support representatives.
      </div>

      <p style="margin-top: 24px; font-size: 14px; color: #1e293b;">Thank you!<br><strong>SmartDeals.in Security Team</strong></p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} SmartDeals.in • Automated security transmission.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Plaintext fallback email content.
 */
export function generateOtpEmailText(otp) {
  return `Hello,

Thank you for registering on our website.

Your email verification OTP is:

${otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

Thank you!
SmartDeals.in Security Team`;
}

/**
 * Dispatches real email using the configured provider:
 * 1. Resend API (RESEND_API_KEY)
 * 2. Brevo API (BREVO_API_KEY)
 * 3. Brevo SMTP / Custom SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS)
 */
export async function sendOtpEmail(toEmail, otp) {
  const subject = "Your Email Verification Code";
  const htmlContent = generateOtpEmailHtml(otp);
  const textContent = generateOtpEmailText(otp);

  const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "SmartDeals <onboarding@resend.dev>";

  // --- 1. RESEND API ---
  if (provider === "resend" || (!provider && resendApiKey)) {
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is missing in your .env configuration.");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [toEmail.trim()],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.message || data?.error?.message || "Resend API rejected request";
      console.error("❌ Resend error:", errMsg);
      throw new Error(`Resend Delivery Failed: ${errMsg}`);
    }

    console.log(`✅ [Resend] Real OTP delivered to ${toEmail} (ID: ${data.id})`);
    return { success: true, provider: "resend", messageId: data.id };
  }

  // --- 2. BREVO API ---
  if (provider === "brevo" || (!provider && brevoApiKey)) {
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is missing in your .env configuration.");
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "no-reply@smartdeals.in";
    const senderName = process.env.BREVO_SENDER_NAME || "SmartDeals.in Security";

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey.trim(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail.trim() }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.message || "Brevo API rejected email request";
      console.error("❌ Brevo error:", errMsg);
      throw new Error(`Brevo Delivery Failed: ${errMsg}`);
    }

    console.log(`✅ [Brevo] Real OTP delivered to ${toEmail} (MessageId: ${data.messageId})`);
    return { success: true, provider: "brevo", messageId: data.messageId };
  }

  // --- 3. SMTP (Brevo SMTP, Gmail App Password, or Custom SMTP) ---
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim(),
      },
    });

    const info = await transporter.sendMail({
      from: emailFrom || `"SmartDeals.in" <${process.env.SMTP_USER.trim()}>`,
      to: toEmail.trim(),
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ [SMTP] Real OTP delivered to ${toEmail} (MessageId: ${info.messageId})`);
    return { success: true, provider: "smtp", messageId: info.messageId };
  }

  // --- 4. NO PROVIDER CONFIGURED ---
  throw new Error(
    "No Email Service configured! Please add BREVO_API_KEY, RESEND_API_KEY, or SMTP credentials in your .env file."
  );
}
