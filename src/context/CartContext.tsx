"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "@/lib/api";

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

function storageKey(userId?: string) {
  return `rasas_local_cart_${userId || "guest"}`;
}

function normalizeServerItem(raw: any): CartItem | null {
  if (!raw?.product) return null;
  const p = raw.product;
  return {
    id: raw.id,
    quantity: raw.quantity,
    product: {
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl || "",
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? 999),
      store: {
        id: p.store?.id || p.storeId || "",
        name: p.store?.name || "Unknown Store",
      },
    },
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUserRef = useRef<string | undefined>(undefined);

  const persistLocal = useCallback(
    (next: CartItem[]) => {
      if (!user) return;
      try {
        localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [user]
  );

  const loadLocal = useCallback((): CartItem[] => {
    if (!user) return [];
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [user]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    const res = await apiFetch<{ items: any[]; itemCount: number }>("/cart");
    if (res.ok && res.data) {
      const mapped = ((res.data as any).items || [])
        .map(normalizeServerItem)
        .filter(Boolean) as CartItem[];
      setItems(mapped);
      persistLocal(mapped);
    } else {
      // Backend unreachable — keep a local cache so UX stays responsive.
      setItems(loadLocal());
    }
    setIsLoading(false);
  }, [user, persistLocal, loadLocal]);

  useEffect(() => {
    if (currentUserRef.current === user?.id) return;
    currentUserRef.current = user?.id;
    fetchCart();
  }, [user?.id, fetchCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) return false;

    // Optimistic update so the UI feels instant
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const max = Math.max(product.stock || 999, 1);
      const next = existing
        ? prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
              : i
          )
        : [
            ...prev,
            {
              id: `tmp-${product.id}`,
              product,
              quantity: Math.max(1, Math.min(quantity, max)),
            },
          ];
      persistLocal(next);
      return next;
    });

    const res = await apiFetch("/cart", {
      method: "POST",
      json: { productId: product.id, quantity },
    });

    if (res.ok) {
      // Re-sync with server so we have real IDs/stock
      await fetchCart();
    }
    return true;
  };

  const removeItem = async (productId: string) => {
    if (!user) return false;
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      persistLocal(next);
      return next;
    });
    await apiFetch(`/cart/${productId}`, { method: "DELETE" });
    return true;
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return false;

    if (quantity <= 0) return removeItem(productId);

    setItems((prev) => {
      const next = prev.map((i) => {
        if (i.product.id !== productId) return i;
        const max = Math.max(i.product.stock || 999, 1);
        return { ...i, quantity: Math.min(quantity, max) };
      });
      persistLocal(next);
      return next;
    });

    await apiFetch(`/cart/${productId}`, {
      method: "PUT",
      json: { quantity },
    });
    return true;
  };

  const clearCart = async () => {
    if (!user) return false;
    setItems([]);
    persistLocal([]);
    await apiFetch("/cart", { method: "DELETE" });
    return true;
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

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
