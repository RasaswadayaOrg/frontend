"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Check, ShoppingBag } from "lucide-react";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  store: { id: string; name: string };
};

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "icon" | "full" | "ecommerce" | "hp2";
}

export function AddToCartButton({ product, quantity = 1, variant = "icon" }: AddToCartButtonProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { addToCart, items } = useCart();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (feedback !== "error") return;
    const timer = setTimeout(() => setFeedback("idle"), 2200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const inCartQuantity = useMemo(
    () => items.find((item) => item.product.id === product.id)?.quantity || 0,
    [items, product.id]
  );



  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      return;
    }

    if (!product?.id) {
      setFeedback("error");
      return;
    }

    setLoading(true);
    setFeedback("idle");

    try {
      const ok = await addToCart(product, quantity);
      if (!ok) {
        setFeedback("error");
        return;
      }
      setFeedback("success");
    } catch (err) {
      console.error("Add to cart error", err);
      setFeedback("error");
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback("idle"), 1800);
    }
  };

  const label = loading
    ? "Adding..."
    : inCartQuantity > 0
      ? "Add Another"
      : "Add to Cart";


  if (variant === "hp2") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          className="hp2-btn hp2-btn--ghost"
          style={{
            width: "100%",
            gap: 8,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            ...(feedback === "success" ? { borderColor: "rgba(134,239,172,0.5)", color: "#86EFAC" } : {}),
          }}
          onClick={handleAddToCart}
          disabled={loading}
          aria-label="Add to cart"
        >
          {feedback === "success" ? <Check size={16} /> : <ShoppingBag size={16} />}
          {label}
        </button>

        <button
          className="hp2-btn hp2-btn--accent"
          style={{
            width: "100%",
            gap: 8,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={async (e) => {
            if (!loading && inCartQuantity === 0) {
              await handleAddToCart(e);
            }
            if (typeof window !== "undefined") window.location.href = "/checkout";
          }}
          disabled={loading}
        >
          Buy It Now
        </button>

        {feedback === "error" && (
          <div
            aria-live="polite"
            style={{
              position: "fixed", bottom: 20, right: 20, zIndex: 9999,
              width: "min(92vw, 340px)",
              background: "#1E1A2B",
              border: "1px solid rgba(251,113,133,0.3)",
              borderRadius: 16,
              padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 10,
              color: "#FCA5A5",
              fontSize: 13,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>Could not add to cart. Please try again.</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "ecommerce") {
    return (
      <div className="flex w-full flex-col sm:flex-row gap-3">
        <button
          className={`group flex-1 py-3.5 px-6 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-brand-600 bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/30 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          } ${feedback === "success" ? "ring-2 ring-emerald-300 flex items-center justify-center text-emerald-600 border-emerald-600" : ""}`}
          onClick={handleAddToCart}
          disabled={loading}
          aria-label="Add to cart"
        >
          {feedback === "success" ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />}
          {label}
        </button>

        <button
          className={`flex-1 py-3.5 px-6 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={async (e) => {
            if (!loading && inCartQuantity === 0) {
              await handleAddToCart(e);
            }
            if (typeof window !== "undefined") window.location.href = "/checkout";
          }}
          disabled={loading}
        >
          Buy It Now
        </button>
        {feedback === "error" && (
          <div
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-xl border shadow-xl backdrop-blur-sm px-4 py-3 bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-950/85 dark:border-rose-800 dark:text-rose-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p className="text-sm font-medium">Could not add to cart</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <>
        <button
          className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          } ${feedback === "success" ? "ring-2 ring-emerald-300/70 dark:ring-emerald-700/70" : ""}`}
          onClick={handleAddToCart}
          disabled={loading}
          aria-label="Add to cart"
        >
          {feedback === "success" ? <Check className="w-5 h-5" /> : <ShoppingBag className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} />}
          {label}
        </button>

        {feedback === "error" && (
          <div
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-xl border shadow-xl backdrop-blur-sm px-4 py-3 bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-950/85 dark:border-rose-800 dark:text-rose-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p className="text-sm font-medium">Could not add to cart</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative inline-flex">
      <button
        className={`p-2 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600 transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${feedback === "success" ? "text-emerald-600 dark:text-emerald-300" : ""}`}
        onClick={handleAddToCart}
        disabled={loading}
        aria-label="Add to cart"
      >
        {feedback === "success" ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingBag className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
        )}
      </button>

      {inCartQuantity > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[10px] leading-4 text-center">
          {inCartQuantity}
        </span>
      )}

      {feedback === "error" && (
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-xl border shadow-xl backdrop-blur-sm px-4 py-3 bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-950/85 dark:border-rose-800 dark:text-rose-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p className="text-sm font-medium">Could not add to cart</p>
          </div>
        </div>
      )}
    </div>
  );
}
