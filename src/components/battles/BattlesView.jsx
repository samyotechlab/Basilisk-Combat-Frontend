import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/Loading';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function BattlesView() {
  const { token } = useAuth();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ outcome: '' });

  useEffect(() => {
    loadBattles();
  }, [token, filter]);

  const loadBattles = async () => {
    try {
      setLoading(true);
      const filters = filter.outcome ? { outcome: filter.outcome } : {};
      const data = await api.getBattleHistory(token, filters);
      setBattles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load battles:', error);
      setBattles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterButtons = [
    { value: '', label: 'All' },
    { value: 'victory', label: 'Victories' },
    { value: 'defeat', label: 'Defeats' },
    { value: 'timeout', label: 'Timeouts' }
  ];

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'victory':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'defeat':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'timeout':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Battle History</h2>
          <p className="text-purple-300">Review past encounters with the Digital Basilisk</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter({ outcome: btn.value })}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter.outcome === btn.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50 border border-purple-500/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Battles List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : battles.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">No battles found</p>
            <p className="text-slate-400 text-sm mt-2">Start optimizing teams and battling the Basilisk!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} getOutcomeColor={getOutcomeColor} />
          ))}
        </div>
      )}
    </div>
  );
}

function BattleCard({ battle, getOutcomeColor }) {
  return (
    <Card hover>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Battle #{battle.id?.toString().slice(0, 8) || 'Unknown'}
          </h3>
          <p className="text-purple-300 text-sm capitalize">
            {battle.terrain || 'Unknown'} Terrain
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-sm font-semibold capitalize ${getOutcomeColor(battle.outcome)}`}>
          {battle.outcome}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem label="Total Damage" value={(battle.total_damage || 0).toFixed(0)} />
        <StatItem label="Duration" value={`${battle.battle_duration || 0} turns`} />
        <StatItem label="Fighters" value={battle.fighter_ids?.length || 0} />
        <StatItem 
          label="Date" 
          value={battle.created_at ? new Date(battle.created_at).toLocaleDateString() : 'N/A'} 
        />
      </div>

      {/* Battle Log Preview */}
      {battle.battle_log && (
        <div className="mt-4 pt-4 border-t border-purple-500/30">
          <details className="cursor-pointer">
            <summary className="text-purple-300 text-sm font-medium hover:text-purple-200">
              View Battle Details
            </summary>
            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
              <pre className="text-xs text-slate-300 overflow-x-auto">
                {JSON.stringify(battle.battle_log, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </Card>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <div className="text-purple-300 text-sm">{label}</div>
      <div className="text-white font-bold text-lg">{value}</div>
    </div>
  );
}

export default BattlesView;