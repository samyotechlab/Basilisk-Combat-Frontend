import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { OverviewView } from './OverviewView';
import { FightersView } from '../fighters/FightersView';
import { CombatView } from '../combat/CombatView';
import { BattlesView } from '../battles/BattlesView';
import { AnalyticsView } from '../analytics/AnalyticsView';

export function Dashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'fighters':
        return <FightersView />;
      case 'combat':
        return <CombatView />;
      case 'battles':
        return <BattlesView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;