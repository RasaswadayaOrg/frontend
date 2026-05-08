"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ClipboardList, MapPin, User, Calendar, Package } from "lucide-react";

type SellerOrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

type SellerOrder = {
  id: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  totalForStore: number;
  buyer: { id: string; fullName: string; email: string } | null;
  items: SellerOrderItem[];
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusStyles: Record<string, string> = {
  PENDING: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  PAID: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SHIPPED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await apiFetch<SellerOrder[]>("/stores/user/my-store/orders");
    if (res.ok && Array.isArray(res.data)) {
      setOrders(res.data);
    } else {
      setError((res as any).error || "Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    const res = await apiFetch(`/orders/${orderId}/status`, {
      method: "PUT",
      json: { status },
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } else {
      alert(res.error || "Failed to update status");
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-b-2 border-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-brand-600" /> Orders
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"} for your store.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            No orders yet
          </h2>
          <p className="text-sm text-neutral-500">
            Orders that contain your products will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Order
                    </p>
                    <p className="text-sm font-mono text-neutral-900 dark:text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  {order.buyer && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <User className="w-3.5 h-3.5" />
                      {order.buyer.fullName || order.buyer.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      statusStyles[order.status] || statusStyles.PENDING
                    }`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 outline-none focus:border-brand-300 dark:focus:border-brand-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-zinc-800 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.imageUrl || "/logo.png"}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty {item.quantity} × LKR {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      LKR {(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 bg-neutral-50/80 dark:bg-zinc-800/40 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 max-w-md">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-brand-500" />
                  <span className="line-clamp-2">{order.shippingAddress}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Your earnings
                  </p>
                  <p className="text-base font-bold text-brand-600 dark:text-brand-400">
                    LKR {Number(order.totalForStore || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
