'use client';

import { useState } from 'react';
import { toggleSponsoredAdStatus } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface ToggleAdStatusProps {
  adId: string;
  isActive: boolean;
}

export function ToggleAdStatus({ adId, isActive }: ToggleAdStatusProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    const result = await toggleSponsoredAdStatus(adId);
    
    if (result.success) {
      setCurrentStatus(!currentStatus);
      router.refresh();
    } else {
      alert(result.message || 'Failed to toggle status');
    }
    
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        currentStatus 
          ? 'bg-green-500' 
          : 'bg-slate-300 dark:bg-zinc-600'
      } ${loading ? 'opacity-50' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          currentStatus ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
