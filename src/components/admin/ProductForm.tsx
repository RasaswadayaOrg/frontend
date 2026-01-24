"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/actions/admin";
import { ImageUpload } from "./ImageUpload";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      const result = isEdit && initialData?.id
        ? await updateProduct(initialData.id, formData)
        : await createProduct(formData);

      if (result.success) {
        router.push("/admin/marketplace");
        router.refresh();
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Traditional Mask"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                defaultValue={initialData?.category}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Handicrafts"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={initialData?.description}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Product description..."
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pricing & Inventory</h3>
            
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-slate-700 dark:text-slate-300">Price (LKR)</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  required
                  defaultValue={initialData?.price}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="2500.00"
                />
              </div>

               <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium text-slate-700 dark:text-slate-300">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  defaultValue={initialData?.stock || 0}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storeId" className="text-sm font-medium text-slate-700 dark:text-slate-300">Store ID {isEdit && "(Cannot be changed)"}</label>
              <input
                type="text"
                id="storeId"
                name="storeId"
                required
                readOnly={isEdit}
                defaultValue={initialData?.storeId}
                className={`w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Store ID"
              />
              {!isEdit && <p className="text-xs text-slate-500">Required: The ID of the store this product belongs to.</p>}
            </div>

             <div className="flex items-center gap-2 pt-2">
               <input 
                 type="checkbox" 
                 id="isActive" 
                 name="isActive" 
                 value="true"
                 defaultChecked={initialData?.isActive !== false}
                 className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
               />
               <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active (Visible in store)</label>
             </div>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Media</h3>
            
            <ImageUpload
              name="imageUrl"
              label="Product Image"
              initialUrl={initialData?.imageUrl}
              aspectRatio="square"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Link 
          href="/admin/marketplace" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}
