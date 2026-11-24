"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, CheckCircle2, X, AlertTriangle } from "@/components/icons";
import { formatPrice } from "@/lib/money";

export function ProductsManager({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form for New Product
  const [form, setForm] = useState({
    nameEn: "",
    nameFr: "",
    slug: "",
    descriptionEn: "450GSM custom heavy terry organic fleece oversized silhouette.",
    descriptionFr: "Sweat à capuche oversize en coton biologique lourd 450GSM.",
    basePriceMillimes: 89000,
    compareAtMillimes: 110000,
    color: "Black",
    colorHex: "#151515",
    imageUrl: "/brand/products/black-signature-hoodie/front.jpg",
    initialStock: 15,
  });

  const filtered = products.filter((p) =>
    p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: nextStatus } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update publish status");
    } catch (err: any) {
      alert(err.message || "Could not update status");
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: currentStatus } : p))
      );
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      setProducts([data.product, ...products]);
      setShowAddModal(false);
      setForm({
        ...form,
        nameEn: "",
        nameFr: "",
        slug: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#181818] border border-[#272727] p-4 rounded">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full bg-[#202020] border border-[#2e2e2e] rounded text-xs pl-8 pr-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#555555]"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-black text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded hover:bg-[#e0e0e0] transition"
        >
          <Plus size={14} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#181818] border border-[#272727] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#272727] bg-[#1d1d1d] text-[11px] uppercase tracking-wider text-[#777777]">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name (EN / FR)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {filtered.map((p) => {
                const totalStock = p.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;

                return (
                  <tr key={p.id} className="hover:bg-[#1f1f1f] transition">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 bg-[#242424] rounded overflow-hidden border border-[#333333]">
                        <Image
                          src={p.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
                          alt={p.nameEn}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{p.nameEn}</span>
                      <span className="text-[10px] text-[#666666] font-mono">{p.slug}</span>
                    </td>
                    <td className="py-3 px-4 text-[#aaaaaa]">
                      {p.category?.nameEn || "Hoodies"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {formatPrice(p.basePriceMillimes)}
                    </td>
                    <td className="py-3 px-4 text-[#aaaaaa]">
                      <span className="font-mono text-white font-semibold">{totalStock}</span> in stock
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p.id, p.isPublished)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          p.isPublished
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-700/80 hover:bg-emerald-900/60"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800"
                        }`}
                        title={p.isPublished ? "Click to switch OFF (hide from website)" : "Click to switch ON (show on website)"}
                      >
                        <span
                          className={`size-2 rounded-full transition-colors ${
                            p.isPublished
                              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                              : "bg-zinc-600"
                          }`}
                        />
                        <span>{p.isPublished ? "ON (Live)" : "OFF (Hidden)"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 text-[#888888] hover:text-white transition"
                          title="Edit product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.nameEn)}
                          className="p-1.5 text-[#888888] hover:text-rose-400 transition"
                          title="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2e2e2e] max-w-xl w-full p-6 space-y-4 rounded shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Add New Garment to Catalog
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#888888] hover:text-white">
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nameEn}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm({
                        ...form,
                        nameEn: v,
                        slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      });
                    }}
                    placeholder="e.g. Blossom Signature Hoodie"
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Name (French)
                  </label>
                  <input
                    type="text"
                    value={form.nameFr}
                    onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                    placeholder="e.g. Sweat à Capuche Sakura"
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Base Price (Millimes) * (89000 = 89.000 TND)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.basePriceMillimes}
                    onChange={(e) => setForm({ ...form, basePriceMillimes: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Strikethrough Price (Millimes)
                  </label>
                  <input
                    type="number"
                    value={form.compareAtMillimes}
                    onChange={(e) => setForm({ ...form, compareAtMillimes: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Primary Color Name
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Initial Stock Per Size (XS–XXL)
                  </label>
                  <input
                    type="number"
                    value={form.initialStock}
                    onChange={(e) => setForm({ ...form, initialStock: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                  Primary Image URL
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white font-mono"
                />
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
                  {loading ? "Publishing..." : "Create & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2e2e2e] max-w-lg w-full p-6 space-y-4 rounded shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Edit Product: {editingProduct.nameEn}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-[#888888] hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                  Product Name (EN)
                </label>
                <input
                  type="text"
                  value={editingProduct.nameEn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Price (Millimes)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.basePriceMillimes}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePriceMillimes: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#888888] block mb-1">
                    Compare At (Millimes)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.compareAtMillimes || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compareAtMillimes: Number(e.target.value) })}
                    className="w-full bg-[#202020] border border-[#2e2e2e] rounded p-2 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isPublished}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                />
                <span>Published in Storefront Catalog</span>
              </label>

              <div className="pt-3 border-t border-[#2a2a2a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#333333] text-[#aaaaaa] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-white text-black font-semibold uppercase text-[11px] rounded hover:bg-[#e0e0e0] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
