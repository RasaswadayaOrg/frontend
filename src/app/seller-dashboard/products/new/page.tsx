import { ProductForm } from "@/components/seller-dashboard/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
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
          New Product
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Add a new item to your store catalog.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
