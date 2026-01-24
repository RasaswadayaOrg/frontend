'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteSponsoredAd } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface DeleteAdButtonProps {
  adId: string;
  adTitle: string;
}

export function DeleteAdButton({ adId, adTitle }: DeleteAdButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteSponsoredAd(adId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message || 'Failed to delete ad');
    }
    
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      title={`Delete ${adTitle}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
