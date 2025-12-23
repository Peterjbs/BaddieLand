/**
 * Stat Utility Functions
 * 
 * Helper functions for:
 * - Converting between old and new stat formats
 * - Import/export stat sheets as JSON
 * - Scaling rows and columns
 */

import { LevelStat } from './firestore-helpers';
import { STATS, StatGrid, computeGrid } from './stat-constants';

export interface StatSheet {
  version: 2;
  cap: 5200;
  
  // 9 levels × 23 stats
  stats: {
    [key: string]: number[];
  };
  
  // 8 multipliers per stat (level transitions 1→2, 2→3, ..., 8→9)
  multipliers: {
    [key: string]: string[]; // 8 multipliers as strings (3dp precision)
  };
  
  // Manual overrides (sparse)
  manual?: {
    [key: string]: {
      [level: number]: string;
    };
  };
  
  // Locks
  locks?: {
    [key: string]: boolean;
  };
  
  // Boundaries (Level 1 base values)
  boundaries?: {
    [key: string]: number;
  };
  
  // Tags
  tags: {
    selected: string[];
    ignored: string[];
    active: string[];
  };
  
  // Timeline tracking
  tracked?: {
    firstNonZero: { [key: string]: number };
    manualJumps?: { [level: number]: Array<{ k: string; d: number }> };
    timeline: string[];
  };
}

/**
 * Convert old 10-level stats to new 9-level system
 * Maps old stat keys to new ones and interpolates missing values
 */
export function convertOldToNew(levelStats?: LevelStat[]): StatSheet {
  const newStats: { [key: string]: number[] } = {};
  const multipliers: { [key: string]: string[] } = {};
  
  // Initialize all stats with zeros
  STATS.forEach(stat => {
    newStats[stat.k] = Array(9).fill(0);
    multipliers[stat.k] = Array(8).fill('1.150');
  });

  if (!levelStats || levelStats.length === 0) {
    // Return default stat sheet
    return {
      version: 2,
      cap: 5200,
      stats: newStats,
      multipliers,
      tags: {
        selected: [],
        ignored: [],
        active: []
      }
    };
  }

  // Sort by level
  const sorted = [...levelStats].sort((a, b) => a.level - b.level);

  // Map old stat keys to new ones (best effort mapping)
  const statMapping: { [oldKey: string]: string } = {
    'hp': 'HPMAX',
    'spd': 'QUICK',
    'bbs': 'BBACK',
    'mla': 'ATMEL',
    'rga': 'ATRNG',
    'maa': 'ATMAG',
    'spa': 'ATSPX',
    'mld': 'DDMEL',
    'rgd': 'DDRNG',
    'mad': 'DDMAG',
    'spd_def': 'DDSPX',
    'eva': 'EVADE',
    'acc': 'ACCUR',
    'crg': 'COURG',
    'int': 'INTUI',
    'agg': 'AGGRO'
  };

  // Extract 9 levels (skip level 10 if it exists)
  const levels = sorted.slice(0, 9);

  // Convert each old stat
  Object.entries(statMapping).forEach(([oldKey, newKey]) => {
    levels.forEach((levelStat, index) => {
      const value = (levelStat as any)[oldKey];
      if (value !== undefined && value !== null) {
        newStats[newKey][index] = typeof value === 'number' ? value : parseInt(value) || 0;
      }
    });

    // Calculate multipliers from actual values
    const mults: string[] = [];
    for (let i = 0; i < 8; i++) {
      if (newStats[newKey][i] > 0 && newStats[newKey][i + 1] > 0) {
        const mult = newStats[newKey][i + 1] / newStats[newKey][i];
        mults.push(mult.toFixed(3));
      } else if (newStats[newKey][i + 1] > 0) {
        mults.push('2.000');
      } else {
        mults.push('1.150');
      }
    }
    multipliers[newKey] = mults;
  });

  return {
    version: 2,
    cap: 5200,
    stats: newStats,
    multipliers,
    tags: {
      selected: [],
      ignored: [],
      active: []
    }
  };
}

/**
 * Convert new 9-level system back to old 10-level format
 * For backwards compatibility
 */
export function convertNewToOld(statSheet: StatSheet): LevelStat[] {
  const levelStats: LevelStat[] = [];

  // Reverse mapping
  const reverseMapping: { [newKey: string]: string } = {
    'HPMAX': 'hp',
    'QUICK': 'spd',
    'BBACK': 'bbs',
    'ATMEL': 'mla',
    'ATRNG': 'rga',
    'ATMAG': 'maa',
    'ATSPX': 'spa',
    'DDMEL': 'mld',
    'DDRNG': 'rgd',
    'DDMAG': 'mad',
    'DDSPX': 'spd_def',
    'EVADE': 'eva',
    'ACCUR': 'acc',
    'COURG': 'crg',
    'INTUI': 'int',
    'AGGRO': 'agg'
  };

  // Create 9 level stats (we'll add a 10th as extrapolation)
  for (let i = 0; i < 9; i++) {
    const levelStat: any = {
      level: i + 1,
      hp: 50,
      bbs: 50,
      spd: 50,
      eva: 50,
      acc: 50,
      mla: 50,
      rga: 50,
      maa: 50,
      spa: 50,
      mld: 50,
      rgd: 50,
      mad: 50,
      spd_def: 50,
      int: 50,
      agg: 50,
      crg: 50,
      xpa: i > 0 ? (i) * 100 * i : 0,
      xpt: (i + 1) * 100 * (i + 1)
    };

    // Map new stats to old format
    Object.entries(reverseMapping).forEach(([newKey, oldKey]) => {
      if (statSheet.stats[newKey]) {
        levelStat[oldKey] = statSheet.stats[newKey][i] || 0;
      }
    });

    levelStats.push(levelStat as LevelStat);
  }

  // Add extrapolated level 10
  const level10: any = {
    level: 10,
    xpa: 9 * 100 * 9,
    xpt: 10 * 100 * 10
  };

  Object.entries(reverseMapping).forEach(([newKey, oldKey]) => {
    if (statSheet.stats[newKey]) {
      // Extrapolate using last multiplier
      const lastMult = parseFloat(statSheet.multipliers[newKey]?.[7] || '1.150');
      level10[oldKey] = Math.floor((statSheet.stats[newKey][8] || 0) * lastMult);
    } else {
      level10[oldKey] = 50;
    }
  });

  levelStats.push(level10 as LevelStat);

  return levelStats;
}

/**
 * Export stat sheet as JSON string
 */
export function exportStatSheet(statSheet: StatSheet): string {
  return JSON.stringify(statSheet, null, 2);
}

/**
 * Import and validate stat sheet from JSON
 */
export function importStatSheet(json: string): StatSheet | null {
  try {
    const data = JSON.parse(json);
    
    // Basic validation
    if (!data.version || data.version !== 2) {
      throw new Error('Invalid stat sheet version');
    }
    
    if (!data.stats || typeof data.stats !== 'object') {
      throw new Error('Missing or invalid stats');
    }
    
    if (!data.multipliers || typeof data.multipliers !== 'object') {
      throw new Error('Missing or invalid multipliers');
    }
    
    if (!data.tags || typeof data.tags !== 'object') {
      throw new Error('Missing or invalid tags');
    }

    // Validate each stat has 9 levels
    STATS.forEach(stat => {
      if (!data.stats[stat.k] || !Array.isArray(data.stats[stat.k]) || data.stats[stat.k].length !== 9) {
        throw new Error(`Invalid stat data for ${stat.k}`);
      }
      
      if (!data.multipliers[stat.k] || !Array.isArray(data.multipliers[stat.k]) || data.multipliers[stat.k].length !== 8) {
        throw new Error(`Invalid multipliers for ${stat.k}`);
      }
    });

    return data as StatSheet;
  } catch (error) {
    console.error('Failed to import stat sheet:', error);
    return null;
  }
}

/**
 * Scale all stats at a specific level by a factor
 * Factor examples: 1.1 = +10%, 0.9 = -10%
 */
export function scaleRow(
  statSheet: StatSheet,
  level: number,
  factor: number
): StatSheet {
  if (level < 0 || level >= 9) {
    throw new Error('Level must be between 0 and 8');
  }

  const newStats = { ...statSheet.stats };
  
  STATS.forEach(stat => {
    if (newStats[stat.k]) {
      newStats[stat.k] = [...newStats[stat.k]];
      newStats[stat.k][level] = Math.floor(newStats[stat.k][level] * factor);
      
      // Clamp to boundaries
      newStats[stat.k][level] = Math.max(stat.lowest, newStats[stat.k][level]);
      newStats[stat.k][level] = Math.min(stat.limit, newStats[stat.k][level]);
    }
  });

  return {
    ...statSheet,
    stats: newStats
  };
}

/**
 * Scale a specific stat across all levels by a factor
 */
export function scaleColumn(
  statSheet: StatSheet,
  statKey: string,
  factor: number
): StatSheet {
  const stat = STATS.find(s => s.k === statKey);
  if (!stat) {
    throw new Error(`Invalid stat key: ${statKey}`);
  }

  const newStats = { ...statSheet.stats };
  
  if (newStats[statKey]) {
    newStats[statKey] = newStats[statKey].map((value, level) => {
      let scaled = Math.floor(value * factor);
      
      // Clamp to boundaries
      scaled = Math.max(stat.lowest, scaled);
      scaled = Math.min(stat.limit, scaled);
      
      // Additional check for level 1
      if (level === 0) {
        scaled = Math.min(stat.lv1Limit, scaled);
      }
      
      return scaled;
    });
  }

  return {
    ...statSheet,
    stats: newStats
  };
}

/**
 * Initialize a default stat sheet with reasonable starting values
 */
export function createDefaultStatSheet(): StatSheet {
  const stats: { [key: string]: number[] } = {};
  const multipliers: { [key: string]: string[] } = {};
  const boundaries: { [key: string]: number } = {};

  STATS.forEach(stat => {
    // Use expected level 1 values
    boundaries[stat.k] = stat.lv1Exp;
    
    // Initialize with default multiplier
    multipliers[stat.k] = Array(8).fill('1.150');
    
    // Compute initial grid
    stats[stat.k] = [stat.lv1Exp];
    for (let i = 1; i < 9; i++) {
      stats[stat.k][i] = Math.floor(stats[stat.k][i - 1] * 1.15);
      // Clamp to limits
      stats[stat.k][i] = Math.min(stats[stat.k][i], stat.limit);
    }
  });

  return {
    version: 2,
    cap: 5200,
    stats,
    multipliers,
    boundaries,
    tags: {
      selected: [],
      ignored: [],
      active: []
    }
  };
}

/**
 * Update a specific cell in the stat grid
 */
export function updateStatValue(
  statSheet: StatSheet,
  statKey: string,
  level: number,
  value: number
): StatSheet {
  const stat = STATS.find(s => s.k === statKey);
  if (!stat) {
    throw new Error(`Invalid stat key: ${statKey}`);
  }

  if (level < 0 || level >= 9) {
    throw new Error('Level must be between 0 and 8');
  }

  // Clamp to boundaries
  let clampedValue = Math.max(stat.lowest, value);
  clampedValue = Math.min(stat.limit, clampedValue);
  
  if (level === 0) {
    clampedValue = Math.min(stat.lv1Limit, clampedValue);
  }

  const newStats = { ...statSheet.stats };
  newStats[statKey] = [...newStats[statKey]];
  newStats[statKey][level] = clampedValue;

  // Record as manual override
  const newManual = { ...(statSheet.manual || {}) };
  if (!newManual[statKey]) {
    newManual[statKey] = {};
  }
  newManual[statKey][level] = clampedValue.toString();

  return {
    ...statSheet,
    stats: newStats,
    manual: newManual
  };
}

/**
 * Update multiplier for a stat at a specific level transition
 */
export function updateMultiplier(
  statSheet: StatSheet,
  statKey: string,
  transitionIndex: number,
  value: string
): StatSheet {
  if (transitionIndex < 0 || transitionIndex >= 8) {
    throw new Error('Transition index must be between 0 and 7');
  }

  const newMultipliers = { ...statSheet.multipliers };
  newMultipliers[statKey] = [...newMultipliers[statKey]];
  newMultipliers[statKey][transitionIndex] = value;

  // Recompute stats with new multiplier
  const boundaries = statSheet.boundaries || {};
  const manual = statSheet.manual || {};
  const locks = statSheet.locks || {};
  
  const newGrid = computeGrid(boundaries, newMultipliers, manual, locks);

  return {
    ...statSheet,
    multipliers: newMultipliers,
    stats: newGrid
  };
}

/**
 * Toggle lock for a stat
 */
export function toggleLock(
  statSheet: StatSheet,
  statKey: string
): StatSheet {
  const newLocks = { ...(statSheet.locks || {}) };
  newLocks[statKey] = !newLocks[statKey];

  // Recompute grid
  const boundaries = statSheet.boundaries || {};
  const multipliers = statSheet.multipliers;
  const manual = statSheet.manual || {};
  
  const newGrid = computeGrid(boundaries, multipliers, manual, newLocks);

  return {
    ...statSheet,
    locks: newLocks,
    stats: newGrid
  };
}

/**
 * Clear manual override for a specific cell
 */
export function clearManualOverride(
  statSheet: StatSheet,
  statKey: string,
  level: number
): StatSheet {
  const newManual = { ...(statSheet.manual || {}) };
  
  if (newManual[statKey]) {
    newManual[statKey] = { ...newManual[statKey] };
    delete newManual[statKey][level];
    
    // Remove empty stat entries
    if (Object.keys(newManual[statKey]).length === 0) {
      delete newManual[statKey];
    }
  }

  // Recompute grid
  const boundaries = statSheet.boundaries || {};
  const multipliers = statSheet.multipliers;
  const locks = statSheet.locks || {};
  
  const newGrid = computeGrid(boundaries, multipliers, newManual, locks);

  return {
    ...statSheet,
    manual: newManual,
    stats: newGrid
  };
}

/**
 * Update boundary (Level 1 base value) for a stat
 */
export function updateBoundary(
  statSheet: StatSheet,
  statKey: string,
  value: number
): StatSheet {
  const stat = STATS.find(s => s.k === statKey);
  if (!stat) {
    throw new Error(`Invalid stat key: ${statKey}`);
  }

  // Clamp to level 1 boundaries
  let clampedValue = Math.max(stat.lv1Low, value);
  clampedValue = Math.min(stat.lv1Limit, clampedValue);

  const newBoundaries = { ...(statSheet.boundaries || {}) };
  newBoundaries[statKey] = clampedValue;

  // Recompute grid
  const multipliers = statSheet.multipliers;
  const manual = statSheet.manual || {};
  const locks = statSheet.locks || {};
  
  const newGrid = computeGrid(newBoundaries, multipliers, manual, locks);

  return {
    ...statSheet,
    boundaries: newBoundaries,
    stats: newGrid
  };
}
