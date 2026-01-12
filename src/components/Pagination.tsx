import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
      </Link>

      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
           // Show first, last, current, and surrounding pages (Simplified for now: show all if < 7, else ellipsis)
           // For this task, I'll stick to a simple list as mock data is small.
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={createPageUrl(currentPage + 1)}
        className={`p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
      </Link>
    </div>
  );
}
