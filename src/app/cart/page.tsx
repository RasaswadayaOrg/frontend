"use client";

import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const { items, itemCount, totalPrice, updateQuantity, removeItem, isLoading, fetchCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Force a fresh cart fetch on load if user exists
    if (user) {
      fetchCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Please login</h2>
        <p className="text-slate-500 mb-6">You need to be logged in to view your cart.</p>
      </div>
    );
  }

  if (isLoading && itemCount === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 mx-auto max-w-2xl mt-10">
        <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our marketplace to find authentic handicrafts!
        </p>
        <Link 
          href="/marketplace" 
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors"
        >
          Explore Marketplace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-6">
      {/* Header */}
      <div>
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-brand-600" />
          Your Cart
        </h1>
        <p className="text-slate-500 mt-1">Review your items before checkout.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative shrink-0">
                  <ImageWithFallback 
                    src={item.product?.imageUrl || "https://placehold.co/200x200?text=No+Image"} 
                    alt={item.product?.name || "Product"} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product?.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mb-1">{item.product?.store?.name}</p>
                  <p className="text-brand-600 font-medium">
                    Rs. {(item.product?.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800 rounded-full px-3 py-1">
                  <button 
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="text-slate-500 hover:text-brand-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-6 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="text-slate-500 hover:text-brand-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-slate-900 dark:text-white">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 mb-6 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-brand-600">Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <button 
              onClick={() => router.push("/checkout")}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-brand-600/20"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}