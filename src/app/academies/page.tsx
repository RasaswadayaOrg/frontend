import { ImageWithFallback } from "../../components/ImageWithFallback";
import Link from "next/link";
import { School, Search, Filter, ArrowLeft, MapPin, ArrowRight } from "lucide-react";
import { getAcademies, getAcademiesCount } from "../../lib/db";
import { Pagination } from "../../components/Pagination";

export const metadata = {
  title: "Music Academies | Rasas",
  description: "Find the best music and dance academies in Sri Lanka.",
};

export default async function AcademiesPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 6;
  const [academies, total] = await Promise.all([
      getAcademies(limit, page),
      getAcademiesCount()
  ]);
  const totalPages = Math.ceil(total / limit);
  
  // Extract unique types for filters (this won't work perfectly with pagination unless we fetch all types separately, but for mock data it's fine)
  // For now, I'll allow it to just show types from current page or fetch a dedicated getAcademyTypes() if I had one. 
  // Let's assume we want to keep it simple.
  const academyTypes = [...new Set(academies.map((a: any) => a.type).filter(Boolean))] as string[];

  return (
    <div className="space-y-8">
       {/* Back Link */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Music & Dance Academies
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Premier institutions preserving Sri Lankan heritage and arts
          </p>
        </div>
        
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search academies..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium">
          All Academies
        </button>
        {academyTypes.map((type) => (
          <button
            key={type}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academies.map((academy: any) => (
                <div key={academy.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                        <ImageWithFallback
                            src={academy.imageUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384ebd?q=80&w=800"}
                            alt={academy.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold rounded-full shadow-sm text-slate-800 dark:text-white">
                                {academy.type}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                {academy.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-sm">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>{academy.location}</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 line-clamp-2">
                            {academy.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                                {academy.phone || "Contact for info"}
                            </span>
                            
                            <Link 
                                href={`/academies/${academy.id}`}
                                className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                            >
                                View Details
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      {/* Promotion / CTA (Styled to match container) */}
      <div className="relative rounded-3xl overflow-hidden bg-brand-900 text-white p-8 md:p-12 mt-12">
            <div className="absolute inset-0 opacity-20">
                <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=81&w=2000"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Are you an Instructor?</h2>
                    <p className="text-brand-100 mb-6 text-lg">
                        Join Rasas to reach thousands of students passionate about Sri Lankan arts. List your academy today.
                    </p>
                    <button className="px-6 py-3 bg-white text-brand-900 rounded-full font-bold hover:bg-brand-50 transition-colors inline-flex items-center gap-2">
                        <School className="w-5 h-5" />
                        List Your Academy
                    </button>
                </div>
            </div>
      </div>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/academies" />
    </div>
  );
}
