"use client";

import React, { useState } from "react";
import { Save, Truck, Store, Phone, CheckCircle2 } from "@/components/icons";

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [flatFee, setFlatFee] = useState(
    (Number(initialSettings["shipping.flatFeeMillimes"] || 7000) / 1000).toString()
  );
  const [freeThreshold, setFreeThreshold] = useState(
    (Number(initialSettings["shipping.freeThresholdMillimes"] || 100000) / 1000).toString()
  );
  const [announcement, setAnnouncement] = useState(
    initialSettings["announcement.text"] ||
      "CASH ON DELIVERY AVAILABLE • NOUVELLE COLLECTION DISPONIBLE"
  );
  const [contactPhone, setContactPhone] = useState(
    initialSettings["store.contactPhone"] || "+216 71 000 000"
  );
  const [contactEmail, setContactEmail] = useState(
    initialSettings["store.contactEmail"] || "contact@silk-streetwear.com"
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        "shipping.flatFeeMillimes": Math.round(Number(flatFee) * 1000).toString(),
        "shipping.freeThresholdMillimes": Math.round(Number(freeThreshold) * 1000).toString(),
        "announcement.text": announcement,
        "store.contactPhone": contactPhone,
        "store.contactEmail": contactEmail,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-white text-black font-semibold uppercase text-[11px] px-5 py-2.5 rounded hover:bg-[#e0e0e0] transition disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? "Saving..." : "Save Parameters"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Store settings persisted to database successfully!</span>
        </div>
      )}

      {/* Shipping & Delivery */}
      <div className="bg-[#181818] border border-[#272727] p-6 rounded space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
          <Truck size={15} />
          <span>Shipping & Cash on Delivery (Tunisia)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#888888]">
              Flat Delivery Fee (TND)
            </label>
            <input
              type="number"
              step="0.5"
              value={flatFee}
              onChange={(e) => setFlatFee(e.target.value)}
              className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-[#555555]"
            />
            <span className="text-[10px] text-[#666666]">Standard nationwide COD courier fee</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#888888]">
              Free Delivery Threshold (TND)
            </label>
            <input
              type="number"
              step="5"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-[#555555]"
            />
            <span className="text-[10px] text-[#666666]">Orders above this threshold receive free shipping</span>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-[#181818] border border-[#272727] p-6 rounded space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
          <Store size={15} />
          <span>Storefront Announcement Banner</span>
        </h3>

        <div className="space-y-1 pt-2">
          <label className="text-[11px] uppercase tracking-wider text-[#888888]">
            Announcement Text
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-[#555555]"
          />
        </div>
      </div>

      {/* Store Contact */}
      <div className="bg-[#181818] border border-[#272727] p-6 rounded space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
          <Phone size={15} />
          <span>Concierge & Verification Contact</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#888888]">
              Phone / WhatsApp
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-[#555555]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#888888]">
              Support Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-[#555555]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
