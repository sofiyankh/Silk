"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, Settings, LogOut, CheckCircle2, Lock, User } from "@/components/icons";

export default function AccountSettingsPage() {
  const [name, setName] = useState("Sofiene Kh");
  const [phone, setPhone] = useState("+216 98 123 456");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setStatusMsg({ type: "success", text: "Profile details updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-silk-cream/40 border border-silk-border p-6 mb-8">
          <h1 className="text-lg font-bold uppercase tracking-wider text-silk-black">
            Account Preferences & Security
          </h1>
          <p className="text-xs text-silk-grey mt-0.5">
            Update personal contact information, telephone number and access credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Menu */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-silk-border p-3 space-y-1 text-xs font-medium">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <Package size={15} />
                <span>My Orders</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <MapPin size={15} />
                <span>Addresses</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <Heart size={15} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 px-3 py-2.5 bg-silk-cream/60 text-silk-black font-semibold rounded"
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <div className="pt-2 border-t border-silk-border">
                <Link
                  href="/api/auth/logout"
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-9">
            <form onSubmit={handleSave} className="bg-white border border-silk-border p-6 space-y-6 max-w-xl">
              {statusMsg && (
                <div
                  className={`p-3 text-xs font-medium rounded ${
                    statusMsg.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black flex items-center gap-2">
                  <User size={14} />
                  <span>Personal Details</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-silk-border text-xs px-3 py-2 text-silk-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey block">Phone (For COD verification)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-silk-border text-xs px-3 py-2 text-silk-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Password update */}
              <div className="space-y-4 pt-6 border-t border-silk-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black flex items-center gap-2">
                  <Lock size={14} />
                  <span>Update Password (Optional)</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey block">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-silk-border text-xs px-3 py-2 text-silk-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey block">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-silk-border text-xs px-3 py-2 text-silk-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3 px-6 hover:bg-silk-charcoal transition disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Preferences"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
