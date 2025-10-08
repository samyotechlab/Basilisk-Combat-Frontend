/* eslint-disable no-unused-vars */
import React from 'react';

export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 ${hover ? 'hover:border-purple-500/50 transition-all' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, gradient }) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-purple-300">{label}</div>
    </Card>
  );
}

export default Card;