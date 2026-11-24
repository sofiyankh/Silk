"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, Check, Package, Heart, Settings, LogOut } from "@/components/icons";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "Sofiene Kh",
    phone: "+216 98 123 456",
    line1: "",
    city: "Tunis",
    governorate: "Tunis",
    postalCode: "1000",
    isDefault: false,
  });

  const governorates = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Bizerte", "Béja", "Jendouba",
    "Le Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili", "Zaghouan"
  ];

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowAddModal(false);
        setForm({ ...form, line1: "" });
        await fetchAddresses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-silk-cream/40 border border-silk-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-silk-black">
              Saved Delivery Addresses
            </h1>
            <p className="text-xs text-silk-grey mt-0.5">
              Manage your residential and office delivery locations for instant COD checkout
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-silk-black text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:bg-silk-charcoal transition"
          >
            <Plus size={14} />
            <span>Add New Address</span>
          </button>
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
                className="flex items-center gap-3 px-3 py-2.5 bg-silk-cream/60 text-silk-black font-semibold rounded"
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
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
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

          {/* Right Content */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="py-12 text-center text-xs text-silk-grey">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="bg-white border border-dashed border-silk-border p-12 text-center space-y-4">
                <MapPin size={28} className="mx-auto text-silk-grey" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-silk-black">
                  No Saved Addresses
                </h3>
                <p className="text-xs text-silk-grey max-w-sm mx-auto">
                  Add your primary delivery address in Tunisia to enable 1-click Cash on Delivery orders.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-silk-black text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white border border-silk-border p-5 space-y-3 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-silk-black" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-silk-black">
                          {a.fullName}
                        </h4>
                      </div>
                      {a.isDefault && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-silk-cream border border-silk-border text-silk-charcoal">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-silk-grey space-y-1">
                      <p className="text-silk-black font-medium">{a.line1}</p>
                      {a.line2 && <p>{a.line2}</p>}
                      <p>{a.city}, {a.governorate} {a.postalCode || ""}</p>
                      <p className="pt-1 text-silk-charcoal font-medium">Tel: {a.phone}</p>
                    </div>

                    <div className="pt-3 border-t border-silk-border/60 flex justify-end">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-xs text-silk-grey hover:text-red-600 flex items-center gap-1 transition"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-silk-border max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
              Add Delivery Location
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-silk-grey uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full border border-silk-border p-2 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] text-silk-grey uppercase block mb-1">Phone Number (Tunisia)</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-silk-border p-2 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] text-silk-grey uppercase block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street, building, apartment..."
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="w-full border border-silk-border p-2 focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-silk-grey uppercase block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-silk-border p-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-silk-grey uppercase block mb-1">Governorate</label>
                  <select
                    value={form.governorate}
                    onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                    className="w-full border border-silk-border p-2 focus:outline-none focus:border-black bg-white"
                  >
                    {governorates.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-silk-grey uppercase block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full border border-silk-border p-2 focus:outline-none focus:border-black"
                />
              </div>
              <label className="flex items-center gap-2 pt-1 text-silk-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-silk-border text-silk-grey hover:text-black uppercase text-[11px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-silk-black text-white uppercase text-[11px] font-semibold hover:bg-silk-charcoal disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
