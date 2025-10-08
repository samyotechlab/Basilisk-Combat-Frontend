import React from 'react';
import { Activity, Users, Sword, Target, TrendingUp } from 'lucide-react';

const navigation = [
  { id: 'overview', name: 'Overview', icon: Activity },
  { id: 'fighters', name: 'Fighters', icon: Users },
  { id: 'combat', name: 'Combat', icon: Sword },
  { id: 'battles', name: 'Battle History', icon: Target },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp }
];

export function Sidebar({ currentView, setCurrentView, menuOpen, setMenuOpen }) {
  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMenuOpen(false);
  };

  return (
    <aside 
      className={`${
        menuOpen ? 'block' : 'hidden'
      } md:block w-64 bg-slate-800/50 backdrop-blur-xl border-r border-purple-500/30 min-h-[calc(100vh-4rem)] p-4`}
    >
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;