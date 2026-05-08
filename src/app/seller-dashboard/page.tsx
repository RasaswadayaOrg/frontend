"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Store as StoreIcon,
  Package,
  ClipboardList,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type ProductRef = { id: string; name: string; imageUrl?: string | null };
type Store = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  products?: ProductRef[];
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: ProductRef;
};

type SellerOrder = {
  id: string;
  status: string;
  totalForStore: number;
  createdAt: string;
  items?: OrderItem[];
  buyer?: { fullName?: string; email?: string } | null;
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function groupByDay(orders: SellerOrder[], days = 30) {
  const map = new Map<string, number>();
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  orders
    .filter((o) => o.status !== "CANCELLED")
    .forEach((o) => {
      const key = o.createdAt.slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + Number(o.totalForStore || 0));
    });
  return Array.from(map.entries()).map(([date, revenue]) => ({
    date: date.slice(5), // "MM-DD"
    revenue,
  }));
}

function groupByWeek(orders: SellerOrder[], weeks = 12) {
  const buckets: Record<string, number> = {};
  const now = Date.now();
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(now - i * 7 * 86400000);
    const label = `W${getWeekNumber(start)}`;
    buckets[label] = 0;
  }
  orders
    .filter((o) => o.status !== "CANCELLED")
    .forEach((o) => {
      const label = `W${getWeekNumber(new Date(o.createdAt))}`;
      if (label in buckets) buckets[label] = (buckets[label] ?? 0) + Number(o.totalForStore || 0);
    });
  return Object.entries(buckets).map(([week, revenue]) => ({ date: week, revenue }));
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
}

function topProducts(orders: SellerOrder[]) {
  const map = new Map<string, { name: string; imageUrl?: string | null; revenue: number; qty: number }>();
  orders
    .filter((o) => o.status !== "CANCELLED")
    .forEach((o) =>
      (o.items || []).forEach((it) => {
        const key = it.product.id;
        const prev = map.get(key) ?? { name: it.product.name, imageUrl: it.product.imageUrl, revenue: 0, qty: 0 };
        map.set(key, {
          ...prev,
          revenue: prev.revenue + Number(it.price) * Number(it.quantity),
          qty: prev.qty + Number(it.quantity),
        });
      })
    );
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   color: "#8b5cf6", icon: Clock        },
  PAID:      { label: "Paid",      color: "#3b82f6", icon: CheckCircle2 },
  SHIPPED:   { label: "Shipped",   color: "#6366f1", icon: Truck        },
  DELIVERED: { label: "Delivered", color: "#10b981", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "#f43f5e", icon: XCircle      },
};

// ─── custom tooltip ───────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 border border-neutral-200/60 dark:border-neutral-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-neutral-500 mb-1">{label}</p>
      <p className="font-bold text-brand-600 dark:text-brand-400">
        LKR {Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [storeRes, ordersRes] = await Promise.all([
        apiFetch<Store>("/stores/user/my-store"),
        apiFetch<SellerOrder[]>("/stores/user/my-store/orders"),
      ]);
      if (storeRes.ok) setStore(storeRes.data ?? null);
      if (ordersRes.ok && Array.isArray(ordersRes.data)) setOrders(ordersRes.data);
      setLoading(false);
    })();
  }, []);

  // derived stats
  const productCount  = store?.products?.length ?? 0;
  const pendingCount  = orders.filter((o) => o.status === "PENDING").length;
  const totalRevenue  = orders.filter((o) => o.status !== "CANCELLED")
                              .reduce((s, o) => s + Number(o.totalForStore || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const dailyData  = useMemo(() => groupByDay(orders, 30),  [orders]);
  const weeklyData = useMemo(() => groupByWeek(orders, 12), [orders]);
  const chartData  = revenueRange === "daily" ? dailyData : weeklyData;
  const chartKey   = "date";

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
      color: STATUS_META[status]?.color ?? "#a3a3a3",
      label: STATUS_META[status]?.label ?? status,
    }));
  }, [orders]);

  const topProds = useMemo(() => topProducts(orders), [orders]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [orders]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-b-2 border-brand-600 animate-spin" />
      </div>
    );
  }

  // ── no store ──
  if (!store) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome, {user?.name?.split(" ")[0] || "Seller"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Set up your store to start selling on the marketplace.
          </p>
        </div>
        <div className="bg-gradient-to-br from-brand-50 to-fuchsia-50 dark:from-brand-900/20 dark:to-fuchsia-900/10 border border-brand-100 dark:border-brand-800/40 rounded-2xl p-8">
          <AlertCircle className="w-10 h-10 text-brand-600 mb-4" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
            You don&apos;t have a store yet
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
            Create your store profile to start listing products and accepting orders.
          </p>
          <Link
            href="/seller-dashboard/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none"
          >
            Create Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `LKR ${totalRevenue.toLocaleString()}`,
      sub: "all time (excl. cancelled)",
      icon: TrendingUp,
      accent: "from-brand-500 to-fuchsia-500",
      href: "/seller-dashboard/orders",
    },
    {
      label: "Products Listed",
      value: productCount,
      sub: "in your catalog",
      icon: Package,
      accent: "from-indigo-500 to-brand-500",
      href: "/seller-dashboard/products",
    },
    {
      label: "Pending Orders",
      value: pendingCount,
      sub: "awaiting action",
      icon: Clock,
      accent: "from-fuchsia-500 to-rose-400",
      href: "/seller-dashboard/orders",
    },
    {
      label: "Delivered",
      value: deliveredCount,
      sub: "completed orders",
      icon: CheckCircle2,
      accent: "from-emerald-500 to-teal-500",
      href: "/seller-dashboard/orders",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {store.name}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Here's what's happening with your store.</p>
        </div>
        <Link
          href="/seller-dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group relative bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-5 overflow-hidden hover:shadow-lg hover:shadow-brand-100/30 dark:hover:shadow-none transition-all duration-200"
            >
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${s.accent} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity`} />
              <div className="relative">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5 leading-tight">
                  {s.value}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{s.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Revenue chart + Order status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue over time */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Revenue Over Time</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">LKR earned per {revenueRange === "daily" ? "day (last 30 days)" : "week (last 12 weeks)"}</p>
            </div>
            <div className="flex bg-neutral-100 dark:bg-zinc-800 rounded-lg p-0.5 gap-0.5 text-[11px] font-semibold">
              {(["daily", "weekly"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRevenueRange(r)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    revenueRange === r
                      ? "bg-white dark:bg-zinc-700 text-brand-700 dark:text-brand-300 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  }`}
                >
                  {r === "daily" ? "30d" : "12w"}
                </button>
              ))}
            </div>
          </div>

          {totalRevenue === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
              No revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" />
                <XAxis dataKey={chartKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status donut */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Order Status</h2>
          <p className="text-[11px] text-neutral-400 mb-4">{orders.length} total orders</p>

          {orders.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
              No orders yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {statusCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any, name: any) => [`${v} orders`, name]}
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-3">
                {statusCounts.map((s) => {
                  return (
                    <div key={s.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-neutral-600 dark:text-neutral-400">{s.label}</span>
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-white">{s.count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top products + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Top products bar chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Top Products</h2>
          <p className="text-[11px] text-neutral-400 mb-4">by revenue (excl. cancelled)</p>

          {topProds.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-neutral-400">
              No product revenue data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={topProds.length * 44 + 16}>
              <BarChart
                data={topProds}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                barSize={10}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" />
                <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + "…" : v}
                />
                <Tooltip
                  formatter={(v: any) => [`LKR ${Number(v).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e5e7eb", background: "white" }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {topProds.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${255 - i * 18}, 70%, ${55 + i * 4}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent orders feed */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Recent Orders</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">Last 5 orders</p>
            </div>
            <Link
              href="/seller-dashboard/orders"
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-neutral-400">
              No orders yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const meta = STATUS_META[order.status];
                const StatusIcon = meta?.icon ?? ShoppingBag;
                const itemCount = (order.items || []).reduce((s, i) => s + i.quantity, 0);
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-zinc-800/50 hover:bg-brand-50/60 dark:hover:bg-brand-900/10 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta?.color}20` }}
                    >
                      <StatusIcon className="w-4 h-4" style={{ color: meta?.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        #{order.id.slice(0, 8).toUpperCase()}
                        {order.buyer?.fullName
                          ? ` · ${order.buyer.fullName.split(" ")[0]}`
                          : order.buyer?.email
                          ? ` · ${order.buyer.email.split("@")[0]}`
                          : ""}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        LKR {Number(order.totalForStore).toLocaleString()}
                      </p>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                        style={{ background: `${meta?.color}1a`, color: meta?.color }}
                      >
                        {meta?.label ?? order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/seller-dashboard/store"
          className="group bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-5 hover:border-brand-200 dark:hover:border-brand-800/60 transition-colors"
        >
          <div className="flex items-center gap-3 mb-1.5">
            <StoreIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Manage Store Profile</h3>
            <ArrowRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 line-clamp-1">
            {store.description || "Keep your store details fresh to build buyer trust."}
          </p>
        </Link>

        <Link
          href="/seller-dashboard/products"
          className="group bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-5 hover:border-brand-200 dark:hover:border-brand-800/60 transition-colors"
        >
          <div className="flex items-center gap-3 mb-1.5">
            <Package className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Manage Products</h3>
            <ArrowRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500">
            {productCount === 0 ? "Add your first product to start selling." : `${productCount} product${productCount !== 1 ? "s" : ""} in your catalog.`}
          </p>
        </Link>
      </div>
    </div>
  );
}
