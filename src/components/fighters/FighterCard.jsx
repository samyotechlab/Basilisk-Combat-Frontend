import React from 'react';
import { Card } from '../common/Card';

export function FighterCard({ fighter, selected = false, onSelect }) {
  const getClassColor = (fighterClass) => {
    switch (fighterClass) {
      case 'warrior':
        return 'from-blue-500 to-cyan-500';
      case 'mage':
        return 'from-purple-500 to-pink-500';
      case 'ranger':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <Card 
      hover 
      className={`cursor-pointer ${selected ? 'ring-2 ring-purple-500' : ''}`}
      onClick={onSelect}
    >
      {/* Class Indicator Bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${getClassColor(fighter.fighter_class)} rounded-full mb-4`}></div>
      
      {/* Fighter Name and Class */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{fighter.name}</h3>
        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm capitalize">
          {fighter.fighter_class}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Health:</span>
          <span className="text-white font-semibold">{fighter.health}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Damage:</span>
          <span className="text-white font-semibold">{fighter.damage}</span>
        </div>
        
        {/* Health Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${Math.min((fighter.health / 150) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Damage Bar */}
        <div className="mt-2">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
              style={{ width: `${Math.min((fighter.damage / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Special Ability */}
        {fighter.special_ability && (
          <div className="mt-3 pt-3 border-t border-purple-500/30">
            <div className="text-purple-300 text-xs font-medium mb-1">Special Ability</div>
            <div className="text-white text-sm">{fighter.special_ability.name}</div>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="mt-4 pt-4 border-t border-purple-500/30">
          <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Selected
          </div>
        </div>
      )}
    </Card>
  );
}

export default FighterCard;