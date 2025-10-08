import React from 'react';

export function Input({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-purple-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 bg-slate-900/50 border ${
          error ? 'border-red-500' : 'border-purple-500/30'
        } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  children,
  className = '', 
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-purple-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-slate-900/50 border ${
          error ? 'border-red-500' : 'border-purple-500/30'
        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function RangeInput({ label, value, min, max, step, onChange, showValue = true }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-purple-300 mb-2">
        {label} {showValue && <span className="text-white">: {value}</span>}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full"
      />
    </div>
  );
}

export default Input;