"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Package, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    store: { name: string };
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const load = async () => {
      setIsLoading(true);
      const res = await apiFetch<Order[]>("/orders");
      if (!res.ok) {
        setError(res.error || "Failed to load orders");
        setIsLoading(false);
        return;
      }
      if (Array.isArray(res.data)) {
        // Map so each item has a totalAmount fallback and flat store info
        const mapped = res.data.map((o: any) => ({
          ...o,
          totalAmount:
            o.totalAmount ??
            (o.items || []).reduce(
              (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0),
              0
            ),
          items: (o.items || []).map((it: any) => ({
            ...it,
            price: Number(it.price ?? 0),
            product: {
              ...it.product,
              store: it.product?.store || { name: "Unknown Store" },
            },
          })),
        }));
        setOrders(mapped);
      }
      setIsLoading(false);
    };

    load();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-brand-600" />
            My Orders
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your past purchases.</p>
        </div>
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900">
          <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm">
            You haven't placed any orders yet. Discover items in the marketplace.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-slate-50 dark:bg-zinc-800/50 flex flex-wrap gap-6 p-4 border-b border-slate-200 dark:border-zinc-800 text-sm">
                <div>
                  <span className="block text-slate-500 mb-1">Order Placed</span>
                  <span className="font-medium flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Total</span>
                  <span className="font-medium text-slate-900 dark:text-white">Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Items</span>
                  <span className="font-medium text-slate-900 dark:text-white">{order.items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-slate-500 mb-1">Order #</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white line-clamp-1 max-w-[120px]">{order.id}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' : 
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                          'bg-brand-100 text-brand-700 dark:bg-brand-900/30'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6 bg-brand-50/50 dark:bg-brand-900/10 p-3 rounded-lg border border-brand-100 dark:border-brand-900/30">
                  <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 dark:text-white mb-0.5">Delivery Address</p>
                    <p className="text-slate-600 dark:text-zinc-400">{order.shippingAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                        <ImageWithFallback 
                          src={item.product?.imageUrl || ""} 
                          alt="" 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white text-base mb-1">{item.product?.name}</h4>
                        <p className="text-sm text-slate-500">Shipped by <span className="font-medium text-slate-700 dark:text-slate-300">{item.product?.store?.name}</span></p>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0 ml-16 sm:ml-0 bg-slate-50 dark:bg-zinc-800/50 px-4 py-2 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Price</p>
                          <p className="font-medium text-sm text-slate-900 dark:text-white">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-zinc-700"></div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Qty</p>
                          <p className="font-medium text-sm text-slate-900 dark:text-white text-center">{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}