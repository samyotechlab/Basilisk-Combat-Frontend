import React from 'react';
import { Shield } from 'lucide-react';

export function Loading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-16 h-16 text-purple-400 animate-pulse mx-auto mb-4" />
        <div className="text-white text-xl">{message}</div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin`}></div>
    </div>
  );
}

export default Loading;