"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "@/components/icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
            Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-silk-black">
            Get In Touch
          </h1>
          <p className="text-xs sm:text-sm text-silk-grey">
            Questions regarding size choices, shipping status, or wholesale inquiries? Our concierge
            team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8 bg-silk-cream/40 border border-silk-border p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black">
              Direct Inquiries
            </h3>

            <div className="space-y-6 text-xs text-silk-charcoal">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white border border-silk-border">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider block text-silk-black">
                    Phone / WhatsApp Concierge
                  </span>
                  <p className="text-silk-grey mt-0.5">
                    <a href="tel:+21658826329" className="hover:underline text-silk-black font-mono">
                      +216 58826329
                    </a>
                  </p>
                  <p className="text-[10px] text-silk-grey">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white border border-silk-border">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider block text-silk-black">
                    Email Support
                  </span>
                  <p className="text-silk-grey mt-0.5">contact@silk-streetwear.com</p>
                  <p className="text-[10px] text-silk-grey">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white border border-silk-border">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider block text-silk-black">
                    Studio & Atelier
                  </span>
                  <p className="text-silk-grey mt-0.5">Monastir, Tunisia</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-silk-border text-[11px] text-silk-grey">
              <strong>Cash on Delivery guarantee:</strong> Every order is accompanied by tracking and
              a phone confirmation call before delivery.
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-silk-border p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-silk-black">
                  Message Transmitted
                </h3>
                <p className="text-xs text-silk-grey max-w-xs mx-auto">
                  Thank you for reaching out. A Silk representative will review your inquiry and
                  contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black mb-2">
                  Send a Message
                </h3>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sofiene Kh"
                    className="w-full bg-silk-cream/20 border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-silk-cream/20 border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-000123"
                    className="w-full bg-silk-cream/20 border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you today?"
                    className="w-full bg-silk-cream/20 border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 hover:bg-silk-charcoal transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
