"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";

type ProductForPurchase = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  storeId: string;
  storeName: string;
};

export function ProductPurchasePanel({ product }: { product: ProductForPurchase }) {
  const [quantity, setQuantity] = useState(1);
  const maxQty = Math.max(product.stock || 999, 1);

  return (
    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-lg">
          <button
            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-3 py-2 font-medium">{quantity}</span>
          <button
            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-sm text-green-600 font-medium">In Stock</span>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <AddToCartButton
            variant="ecommerce"
            quantity={quantity}
            product={{
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              stock: product.stock,
              store: { id: product.storeId, name: product.storeName },
            }}
          />
        </div>
      </div>
    </div>
  );
}
