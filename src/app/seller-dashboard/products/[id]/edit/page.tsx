"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ProductForm, ProductFormData } from "@/components/seller-dashboard/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [initial, setInitial] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<any>(`/products/${id}`);
      if (!res.ok || !res.data) {
        setError(res.ok ? "Product not found" : res.error || "Product not found");
        setLoading(false);
        return;
      }
      const p = res.data;
      setInitial({
        id: p.id,
        name: p.name || "",
        description: p.description || "",
        imageUrl: p.imageUrl || "",
        category: p.category || "",
        stock: Number(p.stock || 0),
        price: Number(p.price || 0),
      });
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/seller-dashboard/products"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Edit Product
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-b-2 border-brand-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      ) : initial ? (
        <ProductForm mode="edit" initial={initial} />
      ) : null}
    </div>
  );
}
