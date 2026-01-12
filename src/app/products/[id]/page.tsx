import { getProduct } from "../../../lib/db";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { AddToCartButton } from "../../../components/AddToCartButton";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Rasas Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Gallery (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-slate-400 overflow-hidden relative">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-xl cursor-pointer hover:ring-2 ring-brand-500 transition-all relative overflow-hidden">
                 <ImageWithFallback
                    src={product.imageUrl}
                    alt={`${product.name} thumb ${i}`}
                    fill
                    className="object-cover opacity-75 hover:opacity-100 transition-opacity"
                 />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Details (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm mb-4">
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 text-slate-300" />
            </div>
            <span className="text-slate-500">(24 reviews)</span>
          </div>
          <p className="text-3xl font-bold text-brand-600">LKR {product.price.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
             <ImageWithFallback 
                src={product.store?.imageUrl || `https://placehold.co/400x400?text=${product.storeName.charAt(0)}`} 
                alt={product.storeName}
                fill
                className="object-cover"
             />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Sold by <span className="font-bold">{product.storeName}</span></p>
            <Link href={`/marketplace/stores/${product.storeId}`} className="text-xs text-brand-600 hover:underline">View Store</Link>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-lg">
              <button className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">-</button>
              <span className="px-3 py-2 font-medium">1</span>
              <button className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">+</button>
            </div>
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
                <AddToCartButton />
                <button className="w-full hidden bg-brand-600 text-white py-3.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
            </div>
            <button className="p-3.5 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          {/* Manual Add to Cart Button since component is icon only */}
            <button className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold hover:bg-brand-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                 <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
        </div>

        <div className="prose prose-slate dark:prose-invert text-sm">
          <h3 className="font-bold">Description</h3>
          <p>
            {product.description || "Authentic Sri Lankan item, handcrafted using traditional methods."}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
