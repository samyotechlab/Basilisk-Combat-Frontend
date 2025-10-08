import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FighterCard } from './FighterCard';
import { CreateFighterModal } from './CreateFighterModal';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/Loading';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function FightersView() {
  const { token } = useAuth();
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    loadFighters();
  }, [token, filterClass]);

  const loadFighters = async () => {
    try {
      setLoading(true);
      const filters = filterClass ? { fighter_class: filterClass } : {};
      const data = await api.getFighters(token, filters);
      setFighters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load fighters:', error);
      setFighters([]);
    } finally {
      setLoading(false);
    }
  };

  const filterButtons = [
    { value: '', label: 'All Classes' },
    { value: 'warrior', label: 'Warriors' },
    { value: 'mage', label: 'Mages' },
    { value: 'ranger', label: 'Rangers' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Fighter Management</h2>
          <p className="text-purple-300">Manage your combat units</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Fighter
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {filterButtons.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterClass(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterClass === filter.value
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50 border border-purple-500/30'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Fighters Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : fighters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-purple-300 text-lg mb-4">No fighters found</p>
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            Create Your First Fighter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fighters.map((fighter) => (
            <FighterCard key={fighter.id} fighter={fighter} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateFighterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadFighters}
      />
    </div>
  );
}

export default FightersView;