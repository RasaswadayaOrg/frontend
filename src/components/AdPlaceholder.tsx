import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'banner' | 'leaderboard';
  label?: string;
}

export function AdPlaceholder({ className = '', size = 'medium', label = 'Advertisement' }: AdPlaceholderProps) {
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
