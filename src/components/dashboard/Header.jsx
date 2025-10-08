import React from 'react';
import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header({ menuOpen, setMenuOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-800/90 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Basilisk Combat</h1>
              <p className="text-xs text-purple-300">Intelligence Platform</p>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-purple-300 text-sm">
              Welcome, <span className="text-white font-semibold">{user?.username}</span>
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium uppercase">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile User Info */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-500/30 p-4">
          <div className="flex flex-col gap-3">
            <div className="text-purple-300 text-sm">
              Welcome, <span className="text-white font-semibold">{user?.username}</span>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium uppercase w-fit">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;