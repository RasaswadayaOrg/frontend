"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        replace(`${window.location.pathname}?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [term, replace, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
}
