import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function CreateFighterModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    health: 100,
    damage: 25,
    fighter_class: 'warrior',
    special_ability: {
      name: '',
      bonus_damage: 0,
      cooldown: 3
    },
    terrain_affinity: {
      forest: 1.0,
      mountains: 1.0,
      swamp: 1.0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0
    });
  };

  const handleSpecialAbilityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      special_ability: {
        ...formData.special_ability,
        [name]: name === 'name' ? value : (parseInt(value) || 0)
      }
    });
  };

  const handleTerrainChange = (terrain, value) => {
    setFormData({
      ...formData,
      terrain_affinity: {
        ...formData.terrain_affinity,
        [terrain]: parseFloat(value)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createFighter(token, formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        health: 100,
        damage: 25,
        fighter_class: 'warrior',
        special_ability: {
          name: '',
          bonus_damage: 0,
          cooldown: 3
        },
        terrain_affinity: {
          forest: 1.0,
          mountains: 1.0,
          swamp: 1.0
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Fighter" maxWidth="max-w-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fighter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter fighter name"
            required
          />

          <Select
            label="Class"
            name="fighter_class"
            value={formData.fighter_class}
            onChange={handleChange}
          >
            <option value="warrior">Warrior (Tank)</option>
            <option value="mage">Mage (DPS)</option>
            <option value="ranger">Ranger (Balanced)</option>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Health"
            name="health"
            type="number"
            min="50"
            max="200"
            value={formData.health}
            onChange={handleNumberChange}
            required
          />

          <Input
            label="Damage"
            name="damage"
            type="number"
            min="10"
            max="60"
            value={formData.damage}
            onChange={handleNumberChange}
            required
          />
        </div>

        {/* Special Ability */}
        <div className="border border-purple-500/30 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold">Special Ability</h4>
          
          <Input
            label="Ability Name"
            name="name"
            value={formData.special_ability.name}
            onChange={handleSpecialAbilityChange}
            placeholder="e.g., Fireball, Shield Wall"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bonus Damage"
              name="bonus_damage"
              type="number"
              min="0"
              max="50"
              value={formData.special_ability.bonus_damage}
              onChange={handleSpecialAbilityChange}
            />

            <Input
              label="Cooldown (turns)"
              name="cooldown"
              type="number"
              min="1"
              max="10"
              value={formData.special_ability.cooldown}
              onChange={handleSpecialAbilityChange}
            />
          </div>
        </div>

        {/* Terrain Affinity */}
        <div className="border border-purple-500/30 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold">Terrain Affinity (Multipliers)</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-purple-300 mb-2">
                Forest: {formData.terrain_affinity.forest.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={formData.terrain_affinity.forest}
                onChange={(e) => handleTerrainChange('forest', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-300 mb-2">
                Mountains: {formData.terrain_affinity.mountains.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={formData.terrain_affinity.mountains}
                onChange={(e) => handleTerrainChange('mountains', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-300 mb-2">
                Swamp: {formData.terrain_affinity.swamp.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={formData.terrain_affinity.swamp}
                onChange={(e) => handleTerrainChange('swamp', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            Create Fighter
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateFighterModal;