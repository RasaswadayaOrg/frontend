import { getProduct } from "../../../lib/db";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";

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

  const reviews = Array.isArray((product as any).reviews) ? (product as any).reviews : [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? reviews.reduce((sum: number, review: any) => sum + Number(review?.rating || 0), 0) / reviewCount
    : 0;
  const roundedRating = Math.round(avgRating);

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
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${index < roundedRating ? "fill-current" : "text-slate-300"}`}
                />
              ))}
            </div>
            <span className="text-slate-500">
              {reviewCount > 0
                ? `${avgRating.toFixed(1)} (${reviewCount} review${reviewCount > 1 ? "s" : ""})`
                : "No reviews yet"}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
             <ImageWithFallback 
                src={product.store?.imageUrl || `https://placehold.co/400x400?text=${(product.storeName || 'S').charAt(0)}`} 
                alt={product.storeName || "Store"}
                fill
                className="object-cover"
             />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Sold by <span className="font-bold">{product.storeName || "Unknown Store"}</span></p>
            <Link href={`/marketplace/stores/${product.storeId}`} className="text-xs text-brand-600 hover:underline">View Store</Link>
          </div>
        </div>

        <ProductPurchasePanel
          product={{
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price || 0,
            stock: product.stock || 999,
            storeId: product.storeId,
            storeName: product.storeName || "Unknown Store",
          }}
        />

        <div className="prose prose-slate dark:prose-invert text-sm">
          <h3 className="font-bold">Description</h3>
          <p>
            {product.description || "Authentic Sri Lankan item, handcrafted using traditional methods."}
          </p>
        </div>

        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-zinc-800" aria-label="Customer reviews">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Reviews</h3>
            {reviewCount > 0 && (
              <span className="text-sm text-slate-500 dark:text-zinc-400">
                {avgRating.toFixed(1)} / 5 from {reviewCount} review{reviewCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {reviewCount === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-4 text-sm text-slate-600 dark:text-zinc-400">
              No reviews yet. Be the first customer to share your feedback on this product.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review: any, index: number) => {
                const reviewerName =
                  review?.user?.name ||
                  review?.userName ||
                  review?.author ||
                  "Verified Customer";
                const rating = Number(review?.rating || 0);
                const createdAt = review?.createdAt ? new Date(review.createdAt) : null;

                return (
                  <article
                    key={review?.id || `${reviewerName}-${index}`}
                    className="rounded-xl border border-slate-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{reviewerName}</p>
                        <div className="flex items-center gap-1 mt-1 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-4 h-4 ${starIndex < rating ? "fill-current" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {createdAt && !Number.isNaN(createdAt.getTime())
                          ? createdAt.toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
                      {review?.comment || review?.text || "Customer shared a star rating without written feedback."}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
    </div>
  );
}
