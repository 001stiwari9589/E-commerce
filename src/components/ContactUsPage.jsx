import { useState, useEffect } from "react";
import { notifyContactWhatsApp, OWNER_WHATSAPP_NUMBER } from "../services/whatsappService";

function ContactUsPage({ onBack, triggerToast }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validate = () => {
    const errs = {};
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2 || !/^[a-zA-Z\s.]{2,}$/.test(name)) {
      errs.name = "Full Name must contain at least 2 letters (letters & spaces only).";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = "Mobile Number must be a valid 10-digit Indian number (starts with 6-9).";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!subject || subject.length < 3) {
      errs.subject = "Subject must be at least 3 characters long.";
    }

    if (!message || message.length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      if (triggerToast) triggerToast("Please fix the highlighted errors in the form!", "warning");
      return;
    }

    // Launch WhatsApp with full contact details and dispatch alert
    notifyContactWhatsApp(formData);

    if (triggerToast) {
      triggerToast("Opening WhatsApp with your support message! Form submitted successfully. 🎉", "success");
    }

    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-slate-800 dark:text-zinc-150 my-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-500 hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Store
      </button>

      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 dark:text-amber-400 uppercase tracking-widest block">
            ✦ 24x7 Direct Customer Support
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Contact Us &amp; Help Center
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 max-w-lg">
            Have questions about orders, payments, or refunds? Send us a direct WhatsApp message or email us directly below.
          </p>
        </div>

        {/* Direct Call / Helpline Button */}
        <a
          href="tel:+919589018011"
          className="flex items-center gap-4 shrink-0 bg-blue-50 hover:bg-blue-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 p-4 rounded-2xl border border-blue-100 dark:border-zinc-800 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center font-bold text-lg">
            📞
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block">Direct Call Support</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">+91 9589018011</span>
          </div>
        </a>
      </div>

      {/* Main Grid: Form + Interactive Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Contact Form with Validation */}
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
            <span>Send us a Direct Message</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              ⚡ Instant WhatsApp Dispatch
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Rahul Sharma"
                className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  errors.name ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-amber-500"
                } rounded-xl text-sm font-semibold transition-all placeholder-gray-400 dark:placeholder-zinc-600 outline-none`}
              />
              {errors.name && <p className="text-[11px] font-bold text-red-500 mt-0.5">⚠️ {errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, phone: clean });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="10 digit mobile number"
                className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  errors.phone ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-amber-500"
                } rounded-xl text-sm font-semibold transition-all placeholder-gray-400 dark:placeholder-zinc-600 outline-none`}
              />
              {errors.phone && <p className="text-[11px] font-bold text-red-500 mt-0.5">⚠️ {errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="rahul@example.com"
                className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  errors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-amber-500"
                } rounded-xl text-sm font-semibold transition-all placeholder-gray-400 dark:placeholder-zinc-600 outline-none`}
              />
              {errors.email && <p className="text-[11px] font-bold text-red-500 mt-0.5">⚠️ {errors.email}</p>}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Subject / Topic *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: "" });
                }}
                placeholder="Order Status / Refund / Inquiry"
                className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                  errors.subject ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-amber-500"
                } rounded-xl text-sm font-semibold transition-all placeholder-gray-400 dark:placeholder-zinc-600 outline-none`}
              />
              {errors.subject && <p className="text-[11px] font-bold text-red-500 mt-0.5">⚠️ {errors.subject}</p>}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Your Message *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: "" });
              }}
              placeholder="Describe your issue or question in detail..."
              className={`px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white border ${
                errors.message ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-amber-500"
              } rounded-xl text-sm font-semibold transition-all placeholder-gray-400 dark:placeholder-zinc-650 outline-none`}
            ></textarea>
            {errors.message && <p className="text-[11px] font-bold text-red-500 mt-0.5">⚠️ {errors.message}</p>}
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-98 text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span>📲</span> Send Message via WhatsApp (+91 9589018011)
          </button>
        </form>

        {/* Quick Contact Interactive Side Cards */}
        <div className="md:col-span-2 flex flex-col gap-4">
          
          {/* Direct WhatsApp Action Card */}
          <a
            href={`https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi ST Mart Support, I have a question regarding my order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">📲</span>
                <div>
                  <h4 className="font-extrabold text-base leading-tight">Direct WhatsApp Support</h4>
                  <p className="text-[11px] text-emerald-100 font-medium">Click to chat instantly with owner</p>
                </div>
              </div>
              <span className="bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">ONLINE</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 font-mono text-xs flex justify-between items-center group-hover:bg-white/20 transition">
              <span>+91 9589018011</span>
              <span className="font-extrabold underline">Open Chat &rarr;</span>
            </div>
          </a>

          {/* Direct Email Action Card */}
          <a
            href="mailto:001satyamtiwari1999@gmail.com?subject=ST%20Mart%20Support%20Inquiry"
            className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:border-blue-500 dark:hover:border-amber-500 transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                📧
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Email Us Directly</h4>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">Opens your default Mail / Gmail app</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800 p-3 rounded-2xl font-mono text-xs text-slate-800 dark:text-zinc-200 flex justify-between items-center group-hover:text-blue-600 dark:group-hover:text-amber-400 transition">
              <span className="truncate">001satyamtiwari1999@gmail.com</span>
              <span className="font-bold text-[11px] shrink-0 ml-1">Send Email &rarr;</span>
            </div>
          </a>

          {/* Headquarters Location Card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2">
              Registered Office Address
            </h4>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">📍</span>
              <div>
                <h5 className="font-bold text-xs text-slate-800 dark:text-zinc-200">ST Mart India Retail Pvt. Ltd.</h5>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed mt-0.5">
                  Embassy Tech Village, Outer Ring Road,<br />
                  Devarabeesanahalli Village, Bengaluru,<br />
                  Karnataka - 560103.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ContactUsPage;
