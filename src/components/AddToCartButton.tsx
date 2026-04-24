"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Check, ShoppingBag, X } from "lucide-react";
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
  variant?: "icon" | "full" | "ecommerce";
}

export function AddToCartButton({ product, quantity = 1, variant = "icon" }: AddToCartButtonProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { addToCart, items } = useCart();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    e.stopPropagation(); // Prevent navigation if inside a Link
    
    if (!user) {
      openAuthModal();
      return;
    }

    setLoading(true);
    const success = await addToCart(product, quantity);
    setLoading(false);

    if (success) {
      setFeedback("success");
      setShowConfirmation(true);
    } else {
      setFeedback("error");
    }
  };

  const label = loading
    ? "Adding..."
    : inCartQuantity > 0
      ? "Add Another"
      : "Add to Cart";

  const confirmationPanel = showConfirmation && feedback === "success" ? (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 w-[min(94vw,420px)] rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl"
    >
      <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Check className="w-4 h-4" />
          <p className="text-sm font-semibold">Added to Cart</p>
        </div>
        <button
          aria-label="Close confirmation"
          onClick={() => setShowConfirmation(false)}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 flex gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[15px] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">{product.name}</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-zinc-800 px-2.5 py-2">
              <p className="text-slate-500 dark:text-zinc-400">Added</p>
              <p className="font-semibold text-slate-900 dark:text-white">{quantity}</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-zinc-800 px-2.5 py-2">
              <p className="text-slate-500 dark:text-zinc-400">Price</p>
              <p className="font-semibold text-slate-900 dark:text-white">Rs. {Number(product.price || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-zinc-800 px-2.5 py-2">
              <p className="text-slate-500 dark:text-zinc-400">In Cart</p>
              <p className="font-semibold text-slate-900 dark:text-white">{inCartQuantity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <button
          onClick={() => setShowConfirmation(false)}
          className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Continue shopping
        </button>
        <button
          onClick={() => { setShowConfirmation(false); router.push("/cart"); }}
          className="px-3.5 py-2.5 rounded-lg border border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
        >
          View cart
        </button>
        <button
          onClick={() => { setShowConfirmation(false); router.push("/checkout"); }}
          className="ml-auto px-3.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  ) : null;

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
        {confirmationPanel}
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

        {confirmationPanel}

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

      {confirmationPanel}

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
