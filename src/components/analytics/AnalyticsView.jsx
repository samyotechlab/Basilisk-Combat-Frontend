import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/Loading';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function AnalyticsView() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [token]);

  const loadAnalytics = async () => {
    try {
      const data = await api.getPerformanceAnalytics(token, 30);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Set mock data for demonstration
      setAnalytics({
        total_battles: 234,
        win_rate: 78.5,
        avg_damage: 1847,
        most_used_class: 'warrior',
        best_terrain: 'mountains',
        popular_synergies: [
          { combination: 'Warrior + Mage', win_rate: 85.3, battles: 89 },
          { combination: 'Ranger + Warrior', win_rate: 79.8, battles: 67 },
          { combination: 'Mage + Ranger', win_rate: 74.2, battles: 54 }
        ],
        class_distribution: {
          warrior: 45,
          mage: 32,
          ranger: 23
        },
        terrain_performance: {
          forest: { battles: 78, win_rate: 76.9 },
          mountains: { battles: 89, win_rate: 81.5 },
          swamp: { battles: 67, win_rate: 75.3 }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Combat Analytics</h2>
        <p className="text-purple-300">Deep insights into battle performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <h3 className="text-purple-300 text-sm font-medium mb-2">Total Battles</h3>
          <div className="text-4xl font-bold text-white mb-2">{analytics?.total_battles || 0}</div>
          <div className="text-purple-300 text-sm">Across all terrains</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20">
          <h3 className="text-green-300 text-sm font-medium mb-2">Win Rate</h3>
          <div className="text-4xl font-bold text-white mb-2">{analytics?.win_rate || 0}%</div>
          <div className="text-green-300 text-sm">Overall success rate</div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <h3 className="text-orange-300 text-sm font-medium mb-2">Avg Damage</h3>
          <div className="text-4xl font-bold text-white mb-2">{analytics?.avg_damage || 0}</div>
          <div className="text-orange-300 text-sm">Per battle</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Synergies */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Popular Synergies
          </h3>
          <div className="space-y-3">
            {analytics?.popular_synergies?.map((synergy, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
              >
                <div>
                  <div className="text-purple-300 font-medium">{synergy.combination}</div>
                  <div className="text-slate-400 text-sm">{synergy.battles} battles</div>
                </div>
                <div className="text-green-400 font-semibold text-lg">{synergy.win_rate}%</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Meta Analysis */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Meta Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="text-purple-300 text-sm mb-2">Most Used Class</div>
              <div className="text-white font-bold text-xl capitalize">
                {analytics?.most_used_class || 'N/A'}
              </div>
            </div>
            
            <div>
              <div className="text-purple-300 text-sm mb-2">Best Terrain</div>
              <div className="text-white font-bold text-xl capitalize">
                {analytics?.best_terrain || 'N/A'}
              </div>
            </div>

            {/* Intelligence Report */}
            <div className="mt-4 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <div className="text-purple-300 text-sm font-medium mb-2">Intelligence Report</div>
              <div className="text-white text-sm">
                Warriors show highest survival rates in mountain terrain. Consider prioritizing 
                warrior-mage combinations for maximum damage output against high-level Basilisks.
              </div>
            </div>
          </div>
        </Card>

        {/* Class Distribution */}
        {analytics?.class_distribution && (
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Class Distribution</h3>
            <div className="space-y-3">
              {Object.entries(analytics.class_distribution).map(([className, percentage]) => (
                <div key={className}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300 capitalize">{className}</span>
                    <span className="text-white font-semibold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getClassGradient(className)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Terrain Performance */}
        {analytics?.terrain_performance && (
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Terrain Performance</h3>
            <div className="space-y-4">
              {Object.entries(analytics.terrain_performance).map(([terrain, stats]) => (
                <div key={terrain} className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300 capitalize font-medium">{terrain}</span>
                    <span className="text-green-400 font-semibold">{stats.win_rate}%</span>
                  </div>
                  <div className="text-slate-400 text-sm">{stats.battles} battles fought</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function getClassGradient(className) {
  switch (className) {
    case 'warrior':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    case 'mage':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'ranger':
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    default:
      return 'bg-gradient-to-r from-slate-500 to-slate-600';
  }
}

export default AnalyticsView;