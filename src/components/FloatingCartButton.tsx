"use client";

import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

const HIDE_ON = ["/cart", "/checkout", "/admin", "/artist-dashboard", "/organizer-dashboard", "/seller-dashboard"];

export function FloatingCartButton() {
  const { itemCount, totalPrice } = useCart();
  const pathname = usePathname();
  const effectivePath = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");

  const hidden = HIDE_ON.some((p) => effectivePath === p || effectivePath.startsWith(p + "/"));

  if (hidden || itemCount === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-2xl bg-[#1a1035]/90 backdrop-blur-md border border-violet-500/30 shadow-2xl shadow-violet-900/40 ring-1 ring-white/5">
          {/* Cart icon + count */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-violet-300" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-[10px] font-bold leading-[18px] text-center">
              {itemCount}
            </span>
          </div>

          {/* Label + price */}
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-violet-300/70 font-medium">Your cart</span>
            <span className="text-sm font-semibold text-white">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-violet-500/20 mx-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/cart"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-violet-300 hover:text-white hover:bg-violet-500/20 transition-all"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-md shadow-violet-900/40 active:scale-95"
            >
              Checkout
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
