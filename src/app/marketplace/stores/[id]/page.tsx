import { getStore, getStoreProducts, getStoreProductsCount } from "../../../../lib/db";
import { ImageWithFallback } from "../../../../components/ImageWithFallback";
import { Pagination } from "../../../../components/Pagination";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, ShoppingBag, ArrowLeft, CheckCircle2, Share2, MessageSquare, Filter } from "lucide-react";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const store = await getStore(params.id);
  if (!store) return { title: "Store Not Found" };
  
  return {
    title: `${store.name} | Rasas Marketplace`,
    description: store.description,
  };
}

export default async function StorePage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ page?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const storeId = params.id;
  const page = Number(searchParams.page) || 1;
  const limit = 8;

  const [store, products, totalProducts] = await Promise.all([
    getStore(storeId),
    getStoreProducts(storeId, limit, page),
    getStoreProductsCount(storeId)
  ]);

  if (!store) {
    return notFound();
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="space-y-8">
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

      {/* Store Header / Hero */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-100 dark:bg-zinc-800">
           <ImageWithFallback
            src={store.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"}
            alt="Store Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 lg:px-10 lg:pb-10 relative">
            <div className="flex flex-col md:flex-row items-end -mt-12 md:-mt-16 gap-6">
                {/* Store Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-zinc-900 p-1.5 shadow-xl relative z-10">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                         <ImageWithFallback
                            src={store.imageUrl || `https://placehold.co/400x400?text=${store.name.charAt(0)}`}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                {store.name}
                                <CheckCircle2 className="w-5 h-5 text-brand-500 fill-brand-50" />
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-600 dark:text-zinc-400">
                                {store.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {store.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 
                                    <span className="font-medium text-slate-900 dark:text-white">{store.rating || 4.5}</span>
                                    <span>({store.reviewCount || 99} reviews)</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <ShoppingBag className="w-4 h-4" /> {totalProducts} Products
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                <Share2 className="w-4 h-4" /> Share
                             </button>
                             <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                                <MessageSquare className="w-4 h-4" /> Contact
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-slate-600 dark:text-zinc-400 max-w-3xl">
                {store.description || "Welcome to our official store on Rasas. We offer high quality traditional items curated just for you."}
            </p>
        </div>

        {/* Tabs */}
        <div className="px-6 lg:px-10 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                <button className="py-4 border-b-2 border-brand-600 text-brand-600 font-medium text-sm whitespace-nowrap">
                    Products ({totalProducts})
                </button>
                <button className="py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium text-sm transition-colors whitespace-nowrap">
                    About Store
                </button>
                 <button className="py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium text-sm transition-colors whitespace-nowrap">
                    Reviews
                </button>
            </div>
        </div>
      </div>

      {/* Main Content: Products Grid */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Products</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter className="w-4 h-4" /> Filter
            </button>
         </div>

         {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                    <div className="aspect-square bg-slate-100 dark:bg-zinc-800 relative">
                    <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    </div>
                    
                    <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    </div>
                </Link>
                ))}
            </div>
         ) : (
             <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                 <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <p className="text-slate-500">No products available yet.</p>
             </div>
         )}
         
         <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/marketplace/stores/${storeId}`} />
      </div>
    </div>
  );
}
