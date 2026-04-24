"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Package, Edit3, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  stock: number;
  category: string | null;
  isActive: boolean;
};

type StoreWithProducts = {
  id: string;
  name: string;
  products?: Product[];
};

export default function SellerProductsPage() {
  const [store, setStore] = useState<StoreWithProducts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const storeRes = await apiFetch<StoreWithProducts>("/stores/user/my-store");
      if (!storeRes.ok) {
        setError(storeRes.error || "Failed to load store");
        setLoading(false);
        return;
      }
      if (!storeRes.data) {
        setStore(null);
        setLoading(false);
        return;
      }
      setStore(storeRes.data);

      const prodRes = await apiFetch<Product[]>(`/stores/${storeRes.data.id}/products`);
      if (prodRes.ok && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      } else {
        setProducts(storeRes.data.products || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-b-2 border-violet-600 animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-violet-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          Create your store first
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          You need a store before you can list products.
        </p>
        <Link
          href="/seller-dashboard/store"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Set up store
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} in {store.name}
          </p>
        </div>
        <Link
          href="/seller-dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
            No products yet
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Add your first product to start selling.
          </p>
          <Link
            href="/seller-dashboard/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/seller-dashboard/products/${p.id}/edit`}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden hover:shadow-lg hover:shadow-violet-100/30 dark:hover:shadow-none hover:border-violet-200 dark:hover:border-violet-800/60 transition-all duration-200"
            >
              <div className="aspect-square relative bg-neutral-100 dark:bg-zinc-800">
                <ImageWithFallback
                  src={p.imageUrl || "/logo.png"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                {!p.isActive && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-neutral-900/80 text-white px-2 py-1 rounded-md">
                    Inactive
                  </span>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                  {p.name}
                </h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                    LKR {Number(p.price).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
