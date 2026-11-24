"use client";

import React, { useState } from "react";
import { Plus, Tag, Trash2, X, Power } from "@/components/icons";

export function DiscountsManager({ initialDiscounts }: { initialDiscounts: any[] }) {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "PERCENT",
    value: 10,
    usageLimit: 100,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create discount");
      setDiscounts([data.discount, ...discounts]);
      setShowAddModal(false);
      setForm({ name: "", code: "", type: "PERCENT", value: 10, usageLimit: 100 });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setDiscounts(
          discounts.map((d) => (d.id === id ? { ...d, isActive: !current } : d))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Permanently delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDiscounts(discounts.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-black text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded hover:bg-[#e0e0e0] transition"
        >
          <Plus size={14} />
          <span>New Discount Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((d) => (
          <div key={d.id} className="bg-[#181818] border border-[#272727] p-5 rounded space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                  {d.name}
                </span>
                <span className="text-lg font-mono font-bold text-white tracking-widest mt-1 block">
                  {d.code}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(d.id, d.isActive)}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 transition ${
                    d.isActive
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                  title="Toggle activation"
                >
                  <Power size={10} />
                  <span>{d.isActive ? "Active" : "Disabled"}</span>
                </button>
                <button
                  onClick={() => handleDelete(d.id, d.code)}
                  className="p-1 text-[#666666] hover:text-rose-400 transition"
                  title="Delete coupon"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252525] flex justify-between text-xs text-[#aaaaaa]">
              <span>Value</span>
              <span className="font-semibold text-white">
                {d.type === "PERCENT" ? `${d.value}% OFF` : `${d.value / 1000} TND OFF`}
              </span>
            </div>

            <div className="flex justify-between text-xs text-[#aaaaaa]">
              <span>Times Applied</span>
              <span className="font-mono text-white">{d.usageCount} orders</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2e2e2e] max-w-md w-full p-6 space-y-4 rounded shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Create Promotional Coupon
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#888888] hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black Friday Launch"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SILK20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Millimes</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Value {form.type === "PERCENT" ? "(0 - 100%)" : "(Millimes)"}
                  </label>
                  <input
                    type="number"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2a2a2a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#333333] text-[#aaaaaa] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-white text-black font-semibold uppercase text-[11px] rounded hover:bg-[#e0e0e0] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
