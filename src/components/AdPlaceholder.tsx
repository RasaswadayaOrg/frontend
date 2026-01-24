"use client";

import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'banner' | 'leaderboard';
  label?: string;
  placement?: string;
  ad?: {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
  } | null;
}

export function AdPlaceholder({ className = '', size = 'medium', label = 'Advertisement', placement, ad }: AdPlaceholderProps) {
  let sizeClasses = '';
  
  switch (size) {
    case 'small':
      sizeClasses = 'h-32';
      break;
    case 'medium':
      sizeClasses = 'h-64';
      break;
    case 'large':
      sizeClasses = 'h-96';
      break;
    case 'banner':
      sizeClasses = 'h-24 w-full';
      break;
    case 'leaderboard':
      sizeClasses = 'h-32 w-full';
      break;
    default:
      sizeClasses = 'h-64';
  }

  // If we have an ad, display it
  if (ad && ad.imageUrl) {
    const handleClick = async () => {
      // Track click
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/ads/${ad.id}/click`, {
          method: 'POST',
        }).catch(() => {});
      } catch {}
    };

    const content = (
      <div className={`relative overflow-hidden rounded-xl ${sizeClasses} ${className}`}>
        <img 
          src={ad.imageUrl} 
          alt={ad.title} 
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium bg-black/50 text-white rounded">
          Sponsored
        </span>
      </div>
    );

    if (ad.linkUrl) {
      return (
        <a 
          href={ad.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block hover:opacity-95 transition-opacity"
        >
          {content}
        </a>
      );
    }

    return content;
  }

  // Fallback placeholder
  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 ${sizeClasses} ${className}`}>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
      <p className="text-sm text-slate-500 mt-2">Space Available</p>
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
      </div>
    </div>
  );
}
