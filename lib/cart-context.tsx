"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item key: `${variantId}`
  variantId: string;
  productId: string;
  productSlug: string;
  name: string;
  priceMillimes: number;
  compareAtMillimes?: number | null;
  size: string;
  color: string;
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalMillimes: number;
  discountMillimes: number;
  discountCode: string | null;
  applyDiscount: (code: string) => Promise<{ success: boolean; message: string }>;
  removeDiscount: () => void;
  shippingMillimes: number;
  totalMillimes: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "silk_cart_v1";
const DISCOUNT_KEY = "silk_discount_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
      const storedDisc = localStorage.getItem(DISCOUNT_KEY);
      if (storedDisc) {
        const d = JSON.parse(storedDisc);
        setDiscountCode(d.code);
        setDiscountPercent(d.percent || 10);
      }
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const key = `${item.variantId}`;
    setItems((prev) => {
      const existing = prev.find((it) => it.id === key);
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
        return prev.map((it) => (it.id === key ? { ...it, quantity: newQty } : it));
      }
      return [...prev, { ...item, id: key }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => {
          if (it.id !== id) return it;
          const next = it.quantity + delta;
          if (next <= 0) return null;
          return { ...it, quantity: Math.min(next, it.maxStock) };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscountPercent(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DISCOUNT_KEY);
  };

  const applyDiscount = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SILK10") {
      setDiscountCode("SILK10");
      setDiscountPercent(10);
      localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: "SILK10", percent: 10 }));
      return { success: true, message: "10% discount applied!" };
    } else if (clean === "WELCOME") {
      setDiscountCode("WELCOME");
      setDiscountPercent(15);
      localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: "WELCOME", percent: 15 }));
      return { success: true, message: "15% welcome discount applied!" };
    }
    return { success: false, message: "Invalid discount code" };
  };

  const removeDiscount = () => {
    setDiscountCode(null);
    setDiscountPercent(0);
    localStorage.removeItem(DISCOUNT_KEY);
  };

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotalMillimes = items.reduce((sum, it) => sum + it.priceMillimes * it.quantity, 0);
  const discountMillimes = discountPercent > 0 ? Math.round((subtotalMillimes * discountPercent) / 100) : 0;
  // Free shipping over 100 TND (100,000 millimes) or 7 TND flat fee
  const shippingMillimes = subtotalMillimes >= 100000 || subtotalMillimes === 0 ? 0 : 7000;
  const totalMillimes = Math.max(0, subtotalMillimes - discountMillimes + shippingMillimes);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotalMillimes,
        discountMillimes,
        discountCode,
        applyDiscount,
        removeDiscount,
        shippingMillimes,
        totalMillimes,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
