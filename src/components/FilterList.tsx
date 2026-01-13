"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface FilterItem {
  id: string;
  name: string;
  icon?: string;
}

interface FilterListProps {
  filters: FilterItem[];
  paramName?: string;
  allLabel?: string;
}

export function FilterList({ 
  filters, 
  paramName = "type", 
  allLabel = "All" 
}: FilterListProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentParam = searchParams.get(paramName);

    const handleFilter = (value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }
        // Reset page to 1 when filtering
        params.delete('page');
        
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button 
                onClick={() => handleFilter(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!currentParam ? 'bg-brand-600 text-white' : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700'}`}
            >
                {allLabel}
            </button>
            {filters.map((filter) => (
                 <button
                    key={filter.id}
                    onClick={() => handleFilter(filter.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${currentParam === filter.id ? 'bg-brand-600 text-white' : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700'}`}
                  >
                    {filter.icon && <span className="mr-2">{filter.icon}</span>}
                    {filter.name}
                  </button>
            ))}
        </div>
    )
}

