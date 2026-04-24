"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  store: { id: string; name: string };
};

type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartStorageKey(userId?: string) {
  return `rasas_local_cart_${userId || "guest"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fallbackFetchState = () => {
    try {
      const localCart = localStorage.getItem(getCartStorageKey(user?.id));
      if (localCart) setItems(JSON.parse(localCart));
      else setItems([]);
    } catch (e) {
      setItems([]);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    fallbackFetchState();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getCartStorageKey(user.id), JSON.stringify(items));
  }, [items, user?.id]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) return false;

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: Math.min(i.quantity + quantity, Math.max(product.stock || 999, 1)),
              }
            : i
        );
      }

      return [...prev, { id: product.id, product, quantity: Math.max(1, quantity) }];
    });

    return true;
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return false;

    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return true;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const max = Math.max(i.product.stock || 999, 1);
        return { ...i, quantity: Math.min(quantity, max) };
      })
    );

    return true;
  };

  const removeItem = async (productId: string) => {
    if (!user) return false;
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    return true;
  };

  const clearCart = async () => {
    if (!user) return false;
    setItems([]);
    localStorage.removeItem(getCartStorageKey(user.id));
    return true;
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.product?.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
