'use client';

import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import { toggleEventFeatured } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface FeaturedToggleProps {
  eventId: string;
  isFeatured: boolean;
  eventTitle: string;
}

export function FeaturedToggle({ eventId, isFeatured: initialIsFeatured, eventTitle }: FeaturedToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const router = useRouter();

  const handleToggle = async () => {
    // Optimistic update
    const newValue = !isFeatured;
    setIsFeatured(newValue);

    startTransition(async () => {
      const result = await toggleEventFeatured(eventId, newValue);
      
      if (!result.success) {
        // Revert on failure
        setIsFeatured(!newValue);
        alert(`Failed to update status for "${eventTitle}": ${result.message}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
        isFeatured 
          ? 'text-amber-500 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-zinc-800'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isFeatured ? "Remove from featured" : "Mark as featured"}
    >
      <Star className={`w-5 h-5 ${isFeatured ? 'fill-current' : ''}`} />
    </button>
  );
}
