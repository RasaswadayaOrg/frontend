"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
  price: number;
}

interface Props {
  initial?: ProductFormData;
  mode: "create" | "edit";
}

export function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initial || {
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      stock: 0,
      price: 0,
    }
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      category: form.category,
      stock: Number(form.stock),
      price: Number(form.price),
    };

    const res =
      mode === "create"
        ? await apiFetch("/products", { method: "POST", json: payload })
        : await apiFetch(`/products/${initial?.id}`, { method: "PUT", json: payload });

    if (!res.ok) {
      setError(res.error || "Failed to save product");
      setSaving(false);
      return;
    }
    router.push("/seller-dashboard/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initial?.id) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    const res = await apiFetch(`/products/${initial.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(res.error || "Failed to delete");
      setDeleting(false);
      return;
    }
    router.push("/seller-dashboard/products");
    router.refresh();
  };

  const inputClass =
    "w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-6 sm:p-8 space-y-6"
    >
      {error && (
        <div className="text-sm rounded-xl px-4 py-3 border bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <div>
          <ImageUpload
            name="imageUrl"
            label="Product Image"
            initialUrl={form.imageUrl}
            onImageChange={(url) => update("imageUrl", url)}
            aspectRatio="square"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What makes this product special?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Price (LKR)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Stock
              </label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => update("stock", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Handloom"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4" /> {deleting ? "Deleting…" : "Delete"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
