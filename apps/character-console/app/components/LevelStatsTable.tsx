'use client';

import { useState, useEffect } from 'react';
import { Character, LevelStats } from '@/lib/schemas';

interface LevelStatsTableProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

const statColumns = [
  'hp', 'bbs', 'spd', 'eva', 'acc', 'mla', 'rga', 'maa', 'spa',
  'mld', 'rgd', 'mad', 'spd_def', 'int', 'agg', 'crg', 'xpa', 'xpt'
];

const defaultStats: LevelStats = {
  level: 1,
  hp: 50, bbs: 50, spd: 50, eva: 50, acc: 50,
  mla: 50, rga: 50, maa: 50, spa: 50,
  mld: 50, rgd: 50, mad: 50, spd_def: 50,
  int: 50, agg: 50, crg: 50,
  xpa: 0, xpt: 100,
};

export default function LevelStatsTable({ character, onUpdate }: LevelStatsTableProps) {
  const [levelStats, setLevelStats] = useState<LevelStats[]>(
    character.level_stats || Array.from({ length: 10 }, (_, i) => ({
      ...defaultStats,
      level: i + 1,
      xpa: i === 0 ? 0 : 100 * i,
      xpt: 100 * (i + 1),
    }))
  );

  useEffect(() => {
    if (character.level_stats && character.level_stats.length === 10) {
      setLevelStats(character.level_stats);
    }
  }, [character]);

  const handleStatChange = (level: number, stat: keyof LevelStats, value: number) => {
    const updated = levelStats.map(ls =>
      ls.level === level ? { ...ls, [stat]: value } : ls
    );
    setLevelStats(updated);
  };

  const handleBlur = () => {
    onUpdate({ level_stats: levelStats });
  };

  const autoCalculate = () => {
    // Simple auto-calculation based on growth curve
    // This is a placeholder - in a real implementation, you'd use the growth curve data
    const baseStats = levelStats[0];
    const calculated = levelStats.map((stats, index) => {
      if (index === 0) return stats;
      const growthFactor = 1 + (index * 0.05); // 5% growth per level
      return {
        ...stats,
        hp: Math.round(baseStats.hp * growthFactor),
        bbs: Math.round(baseStats.bbs * growthFactor),
        spd: Math.round(baseStats.spd * growthFactor),
        eva: Math.round(baseStats.eva * growthFactor),
        acc: Math.round(baseStats.acc * growthFactor),
        mla: Math.round(baseStats.mla * growthFactor),
        rga: Math.round(baseStats.rga * growthFactor),
        maa: Math.round(baseStats.maa * growthFactor),
        spa: Math.round(baseStats.spa * growthFactor),
        mld: Math.round(baseStats.mld * growthFactor),
        rgd: Math.round(baseStats.rgd * growthFactor),
        mad: Math.round(baseStats.mad * growthFactor),
        spd_def: Math.round(baseStats.spd_def * growthFactor),
        int: Math.round(baseStats.int * growthFactor),
        agg: Math.round(baseStats.agg * growthFactor),
        crg: Math.round(baseStats.crg * growthFactor),
        xpa: index === 0 ? 0 : 100 + (index - 1) * 150 + Math.pow(index, 2) * 10,
        xpt: 100 + index * 150 + Math.pow(index + 1, 2) * 10,
      };
    });
    setLevelStats(calculated);
    onUpdate({ level_stats: calculated });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Level Stats</h3>
        <button
          onClick={autoCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded transition"
        >
          Auto-Calculate from Growth Curve
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-2 py-2 text-left sticky left-0 bg-gray-800 z-10">LVL</th>
              {statColumns.map(stat => (
                <th key={stat} className="px-2 py-2 text-center uppercase">{stat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levelStats.map((stats) => (
              <tr key={stats.level} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-2 py-2 font-semibold sticky left-0 bg-gray-800 z-10">{stats.level}</td>
                {statColumns.map(stat => (
                  <td key={stat} className="px-2 py-2">
                    <input
                      type="number"
                      value={stats[stat as keyof LevelStats]}
                      onChange={(e) => handleStatChange(
                        stats.level,
                        stat as keyof LevelStats,
                        parseInt(e.target.value) || 0
                      )}
                      onBlur={handleBlur}
                      className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={stat.startsWith('xp') ? 0 : 1}
                      max={stat.startsWith('xp') ? undefined : 100}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
