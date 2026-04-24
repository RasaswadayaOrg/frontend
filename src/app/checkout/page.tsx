"use client";

import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ArrowLeft, ArrowRight, CreditCard, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function getOrderStorageKey(userId: string) {
  return `rasas_local_orders_${userId}`;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, itemCount, totalPrice, clearCart, isLoading } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/cart");
    }
  }, [user, router]);

  useEffect(() => {
    if (!isLoading && itemCount === 0 && !success) {
      router.push("/cart");
    }
  }, [isLoading, itemCount, success, router]);

  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (itemCount === 0 && !success) {
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Delivery address is required");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const newOrder = {
        id: `ORD-${Date.now()}`,
        totalAmount: totalPrice,
        status: "PENDING",
        shippingAddress: address,
        createdAt: now,
        items: items.map((item) => ({
          id: `${item.product.id}-${Date.now()}`,
          quantity: item.quantity,
          price: item.product.price,
          product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl,
            store: { name: item.product.store?.name || "Unknown Store" },
          },
        })),
      };

      const key = getOrderStorageKey(user.id);
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(key, JSON.stringify([newOrder, ...existing]));
      
      setSuccess(true);
      await clearCart();
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError("Something went wrong while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-green-500 rounded-2xl bg-white dark:bg-zinc-900 mx-auto max-w-2xl mt-10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <Truck className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order placed successfully!</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm">
          Thank you for your purchase. We are redirecting you to your orders page...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-6">
      {/* Header */}
      <div>
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-brand-600" />
          Checkout
        </h1>
        <p className="text-slate-500 mt-1">Complete your order by providing delivery details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              Delivery Details
            </h2>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-200 rounded-lg mb-6 text-sm flex items-center gap-2">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-500 opacity-70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Complete Address
                </label>
                <textarea
                  required
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                Payment Method
              </h2>
              <div className="p-4 border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-900/10 rounded-xl flex items-center justify-between">
                <span className="font-medium text-brand-800 dark:text-brand-200">Cash on Delivery (COD)</span>
                <span className="w-4 h-4 rounded-full border-4 border-brand-600"></span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Pay with cash when your order is delivered to your address.
              </p>
            </div>

            <div className="mt-8">
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-lg bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-md shadow-brand-600/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order - Rs. {totalPrice.toLocaleString()}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Review</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative shrink-0">
                    <ImageWithFallback 
                      src={item.product?.imageUrl || ""} 
                      alt="" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{item.product?.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white text-right">
                    Rs. {(item.product?.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4 text-sm mb-4">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-slate-900 dark:text-white">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span className="font-medium text-slate-900 dark:text-white text-green-500">Free</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-brand-600">Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}