'use client';

import { Character, LevelStat } from '@/lib/firestore-helpers';
import { DEFAULT_LEVEL_STAT, GROWTH_CURVE_FORMULAS } from '@/lib/constants';

interface StatsTableProps {
  character: Character;
  onChange: (character: Character) => void;
}

export default function StatsTable({ character, onChange }: StatsTableProps) {
  const stats = character.levelStats || Array.from({ length: 10 }, (_, i) => ({
    ...DEFAULT_LEVEL_STAT,
    level: i + 1,
    xpt: 100 * (i + 1) * (i + 1),
  }));

  const handleStatChange = (level: number, field: keyof LevelStat, value: number) => {
    const newStats = [...stats];
    const statIndex = newStats.findIndex(s => s.level === level);
    if (statIndex >= 0) {
      newStats[statIndex] = { ...newStats[statIndex], [field]: value };
    }
    onChange({ ...character, levelStats: newStats });
  };

  const generateStats = () => {
    const curve = GROWTH_CURVE_FORMULAS[character.growthCurve] || GROWTH_CURVE_FORMULAS.steady;
    const newStats: LevelStat[] = Array.from({ length: 10 }, (_, i) => {
      const level = i + 1;
      const base = curve(level);
      return {
        level,
        hp: Math.min(100, base + 10),
        bbs: Math.min(100, base),
        spd: Math.min(100, base - 5),
        eva: Math.min(100, base - 10),
        acc: Math.min(100, base),
        mla: Math.min(100, base),
        rga: Math.min(100, base - 5),
        maa: Math.min(100, base - 10),
        spa: Math.min(100, base - 15),
        mld: Math.min(100, base),
        rgd: Math.min(100, base - 5),
        mad: Math.min(100, base - 10),
        spd_def: Math.min(100, base - 10),
        int: Math.min(100, base),
        agg: Math.min(100, base),
        crg: Math.min(100, base - 5),
        xpa: level > 1 ? (level - 1) * 100 * (level - 1) : 0,
        xpt: level * 100 * level,
      };
    });

    onChange({ ...character, levelStats: newStats });
  };

  const statFields: Array<{ key: keyof LevelStat; label: string }> = [
    { key: 'level', label: 'LVL' },
    { key: 'hp', label: 'HP' },
    { key: 'bbs', label: 'BBS' },
    { key: 'spd', label: 'SPD' },
    { key: 'eva', label: 'EVA' },
    { key: 'acc', label: 'ACC' },
    { key: 'mla', label: 'MLA' },
    { key: 'rga', label: 'RGA' },
    { key: 'maa', label: 'MAA' },
    { key: 'spa', label: 'SPA' },
    { key: 'mld', label: 'MLD' },
    { key: 'rgd', label: 'RGD' },
    { key: 'mad', label: 'MAD' },
    { key: 'spd_def', label: 'SPD_DEF' },
    { key: 'int', label: 'INT' },
    { key: 'agg', label: 'AGG' },
    { key: 'crg', label: 'CRG' },
    { key: 'xpa', label: 'XPA' },
    { key: 'xpt', label: 'XPT' },
  ];

  return (
    <div>
      <button className="button" onClick={generateStats} style={{ marginBottom: '1rem' }}>
        Generate Stats Based on Growth Curve
      </button>

      <div style={{ overflowX: 'auto' }}>
        <table className="stats-table">
          <thead>
            <tr>
              {statFields.map(field => (
                <th key={field.key}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => (
              <tr key={stat.level}>
                {statFields.map(field => (
                  <td key={field.key}>
                    {field.key === 'level' ? (
                      stat.level
                    ) : (
                      <input
                        type="number"
                        value={stat[field.key]}
                        onChange={(e) => handleStatChange(stat.level, field.key, parseInt(e.target.value) || 0)}
                        min={field.key === 'xpa' || field.key === 'xpt' ? 0 : 1}
                        max={field.key === 'xpa' || field.key === 'xpt' ? undefined : 100}
                      />
                    )}
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
