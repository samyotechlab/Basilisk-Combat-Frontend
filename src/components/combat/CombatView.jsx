import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { FighterCard } from '../fighters/FighterCard';
import { Select, RangeInput } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/Loading';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function CombatView() {
  const { token } = useAuth();
  const [fighters, setFighters] = useState([]);
  const [selectedFighters, setSelectedFighters] = useState([]);
  const [config, setConfig] = useState({
    terrain: 'forest',
    basilisk_base_damage: 30,
    rage_multiplier: 1.05,
    battle_duration_limit: 50
  });
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFighters, setLoadingFighters] = useState(true);

  useEffect(() => {
    loadFighters();
  }, [token]);

  const loadFighters = async () => {
    try {
      const data = await api.getFighters(token);
      setFighters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load fighters:', error);
    } finally {
      setLoadingFighters(false);
    }
  };

  const toggleFighter = (fighterId) => {
    if (selectedFighters.includes(fighterId)) {
      setSelectedFighters(selectedFighters.filter(id => id !== fighterId));
    } else if (selectedFighters.length < 5) {
      setSelectedFighters([...selectedFighters, fighterId]);
    }
  };

  const handleOptimize = async () => {
    if (selectedFighters.length < 2) {
      alert('Select at least 2 fighters');
      return;
    }

    setLoading(true);
    setOptimization(null);
    
    try {
      const availableFighters = fighters.filter(f => selectedFighters.includes(f.id));
      const result = await api.optimizeTeam(token, {
        fighters: availableFighters,
        config: config,
        optimization_mode: 'balanced'
      });
      setOptimization(result);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Optimization failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Combat Optimization</h2>
        <p className="text-purple-300">Find the optimal team to defeat the Digital Basilisk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fighter Selection */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">
              Select Fighters ({selectedFighters.length}/5)
            </h3>
            
            {loadingFighters ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {fighters.map((fighter) => (
                  <FighterCard
                    key={fighter.id}
                    fighter={fighter}
                    selected={selectedFighters.includes(fighter.id)}
                    onSelect={() => toggleFighter(fighter.id)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Battle Configuration */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Battle Configuration</h3>
            
            <div className="space-y-4">
              <Select
                label="Terrain"
                value={config.terrain}
                onChange={(e) => setConfig({ ...config, terrain: e.target.value })}
              >
                <option value="forest">CyberForest</option>
                <option value="mountains">QuantumMountains</option>
                <option value="swamp">DataSwamp</option>
              </Select>

              <RangeInput
                label="Basilisk Base Damage"
                value={config.basilisk_base_damage}
                min={20}
                max={50}
                step={1}
                onChange={(e) => setConfig({ ...config, basilisk_base_damage: parseInt(e.target.value) })}
              />

              <RangeInput
                label="Rage Multiplier"
                value={config.rage_multiplier}
                min={1.00}
                max={1.20}
                step={0.01}
                onChange={(e) => setConfig({ ...config, rage_multiplier: parseFloat(e.target.value) })}
              />

              <RangeInput
                label="Duration Limit (turns)"
                value={config.battle_duration_limit}
                min={30}
                max={100}
                step={5}
                onChange={(e) => setConfig({ ...config, battle_duration_limit: parseInt(e.target.value) })}
              />

              <Button
                onClick={handleOptimize}
                disabled={loading || selectedFighters.length < 2}
                loading={loading}
                className="w-full"
              >
                <Zap className="w-5 h-5 inline mr-2" />
                Optimize Team
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Optimization Results */}
      {optimization && (
        <Card>
          <h3 className="text-2xl font-bold text-white mb-6">Optimization Results</h3>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard
              label="Victory Probability"
              value={`${((optimization.ml_predictions?.victory_probability || 0) * 100).toFixed(1)}%`}
              gradient="from-green-500/20 to-emerald-500/20"
              borderColor="border-green-500/30"
              textColor="text-green-300"
            />
            
            <MetricCard
              label="Expected Damage"
              value={(optimization.algorithm_result?.total_damage || 0).toFixed(0)}
              gradient="from-orange-500/20 to-red-500/20"
              borderColor="border-orange-500/30"
              textColor="text-orange-300"
            />
            
            <MetricCard
              label="Battle Duration"
              value={`${optimization.battle_simulation?.duration || 0} turns`}
              gradient="from-blue-500/20 to-cyan-500/20"
              borderColor="border-blue-500/30"
              textColor="text-blue-300"
            />
          </div>

          {/* Strategy */}
          {optimization.strategy && (
            <div className="mb-6 p-4 bg-slate-900/50 border border-purple-500/30 rounded-lg">
              <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recommended Strategy
              </h4>
              <p className="text-white">{optimization.strategy}</p>
            </div>
          )}

          {/* Synergy Bonuses */}
          {optimization.battle_simulation?.synergy_bonuses && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 border border-purple-500/30 rounded-lg">
                <h4 className="text-purple-300 font-semibold mb-3">Synergy Bonuses</h4>
                <div className="space-y-2">
                  {Object.entries(optimization.battle_simulation.synergy_bonuses).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-slate-300 capitalize text-sm">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-green-400 font-semibold">+{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {optimization.battle_simulation?.damage_breakdown && (
                <div className="p-4 bg-slate-900/50 border border-purple-500/30 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-3">Damage Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(optimization.battle_simulation.damage_breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-slate-300 capitalize text-sm">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-red-400 font-semibold">{value?.toFixed(1) || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function MetricCard({ label, value, gradient, borderColor, textColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border ${borderColor} rounded-lg p-4`}>
      <div className={`${textColor} text-sm mb-1`}>{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

export default CombatView;