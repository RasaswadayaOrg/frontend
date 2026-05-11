import { getProducts, getProductsCount, getStores, getAdminOrders, getAdminOrdersCount } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Search, Package, Store, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DeleteProductButton } from "@/app/admin/(dashboard)/marketplace/DeleteProductButton";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export default async function AdminMarketplacePage(
  { searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }
) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);
  const search = (sp?.q || "").trim() || undefined;

  const [products, stores, orders, productsCount, ordersCount] = await Promise.all([
    getProducts(PAGE_SIZE, page, search),
    getStores(50),
    getAdminOrders(20, 1),
    getProductsCount(search),
    getAdminOrdersCount()
  ]);

  const totalPages = Math.max(1, Math.ceil(productsCount / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, productsCount);
  const buildHref = (p: number) => {
    const qs = new URLSearchParams();
    if (p > 1) qs.set("page", String(p));
    if (search) qs.set("q", search);
    const s = qs.toString();
    return s ? `/admin/marketplace?${s}` : `/admin/marketplace`;
  };
  // Compact page window: current ±2, with edges + ellipses
  const windowed: (number | "…")[] = (() => {
    const items: (number | "…")[] = [];
    const pushRange = (a: number, b: number) => { for (let i = a; i <= b; i++) items.push(i); };
    const radius = 2;
    if (totalPages <= 7) { pushRange(1, totalPages); return items; }
    items.push(1);
    if (page - radius > 2) items.push("…");
    pushRange(Math.max(2, page - radius), Math.min(totalPages - 1, page + radius));
    if (page + radius < totalPages - 1) items.push("…");
    items.push(totalPages);
    return items;
  })();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marketplace Management</h1>
          <p className="text-sm text-slate-500">Manage products, stores, and orders.</p>
        </div>
        <Link href="/admin/marketplace/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Package className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{productsCount}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-brand-100 dark:bg-brand-900/20">
              <Store className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Stores</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stores.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{ordersCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Products</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {productsCount > 0
                ? `Showing ${startIdx}–${endIdx} of ${productsCount}`
                : "No products"}
            </p>
          </div>
          <form action="/admin/marketplace" method="get" className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={search ?? ""}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </form>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-lg relative overflow-hidden flex-shrink-0">
                        <ImageWithFallback 
                          src={product.imageUrl || `https://placehold.co/400x400?text=${product.name?.charAt(0) || 'P'}`}
                          alt={product.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description?.substring(0, 40) || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock || 0} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {product.store?.name || product.storeName || "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/marketplace/${product.id}/edit`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {search
                      ? `No products match "${search}".`
                      : "No products found. Add one to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-zinc-800 flex-wrap">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <nav className="flex items-center gap-1" aria-label="Products pagination">
              {page > 1 ? (
                <Link
                  href={buildHref(page - 1)}
                  className="inline-flex items-center gap-1 px-3 h-9 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 h-9 text-sm rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-300 dark:text-zinc-700">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </span>
              )}

              {windowed.map((it, i) =>
                it === "…" ? (
                  <span key={`gap-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                ) : it === page ? (
                  <span
                    key={it}
                    aria-current="page"
                    className="inline-flex items-center justify-center w-9 h-9 text-sm rounded-lg bg-brand-600 text-white font-medium"
                  >
                    {it}
                  </span>
                ) : (
                  <Link
                    key={it}
                    href={buildHref(it)}
                    className="inline-flex items-center justify-center w-9 h-9 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {it}
                  </Link>
                )
              )}

              {page < totalPages ? (
                <Link
                  href={buildHref(page + 1)}
                  className="inline-flex items-center gap-1 px-3 h-9 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Next page"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 h-9 text-sm rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-300 dark:text-zinc-700">
                  Next <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
          <Link href="/admin/marketplace/orders" className="text-sm text-brand-600 hover:text-blue-500 font-medium">
            View All
          </Link>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">
                    {order.user?.fullName || order.shippingAddress?.name || 'Customer'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
