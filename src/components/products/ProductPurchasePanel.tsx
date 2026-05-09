"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Package } from "lucide-react";

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
  const inStock = (product.stock ?? 1) > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 20, borderTop: "1px solid rgba(196,181,253,0.10)" }}>

      {/* Qty + stock row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

        {/* Stepper */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 12,
          border: "1px solid rgba(196,181,253,0.15)",
          background: "#1E1A2B",
          overflow: "hidden",
        }}>
          <button
            style={{
              width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "#C4B5FD",
              fontSize: 18,
              cursor: quantity <= 1 ? "not-allowed" : "pointer",
              opacity: quantity <= 1 ? 0.35 : 1,
              transition: "background .15s",
            }}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span style={{
            minWidth: 36,
            textAlign: "center",
            fontFamily: "var(--font-outfit)",
            fontWeight: 600,
            fontSize: 15,
            color: "#F5F3FA",
            padding: "0 4px",
          }}>
            {quantity}
          </span>
          <button
            style={{
              width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "#C4B5FD",
              fontSize: 18,
              cursor: quantity >= maxQty ? "not-allowed" : "pointer",
              opacity: quantity >= maxQty ? 0.35 : 1,
              transition: "background .15s",
            }}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Stock badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 999,
          background: inStock ? "rgba(134,239,172,0.08)" : "rgba(252,165,165,0.08)",
          border: "1px solid " + (inStock ? "rgba(134,239,172,0.20)" : "rgba(252,165,165,0.20)"),
        }}>
          <Package size={12} style={{ color: inStock ? "#86EFAC" : "#FCA5A5" }} />
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: inStock ? "#86EFAC" : "#FCA5A5",
          }}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <AddToCartButton
        variant="hp2"
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
  );
}
