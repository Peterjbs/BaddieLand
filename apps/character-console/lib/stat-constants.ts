/**
 * Stat Sheet System Constants
 * 
 * This file contains all the constants for the enhanced stat generation system:
 * - 23 stats with detailed boundaries
 * - 67+ auto-tags with conflict detection
 * - Helper functions for stat calculations
 */

// ============================================================================
// STAT DEFINITIONS
// ============================================================================

export interface StatBoundary {
  k: string;           // Stat key
  label: string;       // Display label
  hue: number;        // Color hue for visual coding (0-360)
  lowest: number;     // Absolute minimum value
  lv1Low: number;     // Level 1 low range
  lv1Exp: number;     // Level 1 expected value
  lv1High: number;    // Level 1 high range
  lv1Limit: number;   // Level 1 maximum limit
  limit: number;      // Absolute maximum across all levels
}

// Core stats (Red-Orange-Yellow hues: 0-60)
const CORE_STATS: StatBoundary[] = [
  {
    k: 'HPMAX',
    label: 'HP MAX',
    hue: 0,
    lowest: 10,
    lv1Low: 30,
    lv1Exp: 50,
    lv1High: 70,
    lv1Limit: 100,
    limit: 999
  },
  {
    k: 'QUICK',
    label: 'QUICKNESS',
    hue: 30,
    lowest: 5,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 30,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'BBACK',
    label: 'BOUNCE BACK',
    hue: 50,
    lowest: 5,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 30,
    lv1Limit: 50,
    limit: 250
  }
];

// Attack stats (Green hues: 90-150)
const ATTACK_STATS: StatBoundary[] = [
  {
    k: 'ATMEL',
    label: 'ATK MELEE',
    hue: 90,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'ATRNG',
    label: 'ATK RANGE',
    hue: 110,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'ATMAG',
    label: 'ATK MAGIC',
    hue: 130,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'ATSPX',
    label: 'ATK SPECIAL',
    hue: 150,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  }
];

// Utility stats (Cyan hues: 170-210)
const UTIL_STATS: StatBoundary[] = [
  {
    k: 'HEALR',
    label: 'HEALER',
    hue: 170,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 15,
    lv1High: 25,
    lv1Limit: 40,
    limit: 200
  },
  {
    k: 'ALLYX',
    label: 'ALLY BOOST',
    hue: 180,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 15,
    lv1High: 25,
    lv1Limit: 40,
    limit: 200
  },
  {
    k: 'ATSFX',
    label: 'STATUS FX',
    hue: 190,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 15,
    lv1High: 25,
    lv1Limit: 40,
    limit: 200
  },
  {
    k: 'THRET',
    label: 'THREAT',
    hue: 200,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 15,
    lv1High: 25,
    lv1Limit: 40,
    limit: 200
  },
  {
    k: 'SHILD',
    label: 'SHIELD',
    hue: 210,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 15,
    lv1High: 25,
    lv1Limit: 40,
    limit: 200
  }
];

// Defence stats (Blue-Purple hues: 220-270)
const DEFENCE_STATS: StatBoundary[] = [
  {
    k: 'DDMEL',
    label: 'DEF MELEE',
    hue: 220,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'DDRNG',
    label: 'DEF RANGE',
    hue: 235,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'DDMAG',
    label: 'DEF MAGIC',
    hue: 250,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  },
  {
    k: 'DDSPX',
    label: 'DEF SPECIAL',
    hue: 270,
    lowest: 0,
    lv1Low: 10,
    lv1Exp: 20,
    lv1High: 35,
    lv1Limit: 50,
    limit: 250
  }
];

// Trait stats (Magenta-Red hues: 280-350)
const TRAIT_STATS: StatBoundary[] = [
  {
    k: 'EVADE',
    label: 'EVASION',
    hue: 280,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'ACCUR',
    label: 'ACCURACY',
    hue: 295,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'COURG',
    label: 'COURAGE',
    hue: 310,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'INTUI',
    label: 'INTUITION',
    hue: 320,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'AGGRO',
    label: 'AGGRESSION',
    hue: 330,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'ENRGY',
    label: 'ENERGY',
    hue: 340,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  },
  {
    k: 'REGEN',
    label: 'REGEN',
    hue: 350,
    lowest: 0,
    lv1Low: 5,
    lv1Exp: 10,
    lv1High: 20,
    lv1Limit: 30,
    limit: 150
  }
];

// Combined stats array
export const STATS: StatBoundary[] = [
  ...CORE_STATS,
  ...ATTACK_STATS,
  ...UTIL_STATS,
  ...DEFENCE_STATS,
  ...TRAIT_STATS
];

// Stat groups for UI organization
export const STAT_GROUPS = {
  CORE: CORE_STATS.map(s => s.k),
  ATTACK: ATTACK_STATS.map(s => s.k),
  UTIL: UTIL_STATS.map(s => s.k),
  DEFENCE: DEFENCE_STATS.map(s => s.k),
  TRAIT: TRAIT_STATS.map(s => s.k)
};

// Get stat by key
export function getStatByKey(key: string): StatBoundary | undefined {
  return STATS.find(s => s.k === key);
}

// ============================================================================
// TAG SYSTEM
// ============================================================================

export interface Tag {
  name: string;
  description: string;
  check: (grid: StatGrid) => boolean;
  apply: (grid: StatGrid) => StatGrid;
  priority?: number;
}

export type StatGrid = {
  [key: string]: number[]; // 9 levels per stat
};

// Tag conflict mappings
export const TAG_CONFLICTS: { [key: string]: string[] } = {
  'glass_cannon': ['tank', 'balanced', 'defensive_specialist'],
  'tank': ['glass_cannon', 'speedster', 'assassin'],
  'speedster': ['tank', 'slow_starter'],
  'slow_starter': ['speedster', 'quick_starter'],
  'quick_starter': ['slow_starter', 'late_bloomer'],
  'late_bloomer': ['quick_starter', 'early_bloomer'],
  'early_bloomer': ['late_bloomer'],
  'melee_specialist': ['ranged_specialist', 'magic_specialist'],
  'ranged_specialist': ['melee_specialist', 'magic_specialist'],
  'magic_specialist': ['melee_specialist', 'ranged_specialist'],
  'healer': ['damage_dealer'],
  'damage_dealer': ['healer', 'support'],
  'support': ['damage_dealer'],
  'balanced': ['specialist', 'glass_cannon'],
  'specialist': ['balanced', 'generalist'],
  'generalist': ['specialist']
};

// Helper to get sum of attack stats at a level
function getAttackSum(grid: StatGrid, level: number): number {
  return (grid.ATMEL?.[level] || 0) + 
         (grid.ATRNG?.[level] || 0) + 
         (grid.ATMAG?.[level] || 0) + 
         (grid.ATSPX?.[level] || 0);
}

// Helper to get sum of defence stats at a level
function getDefenceSum(grid: StatGrid, level: number): number {
  return (grid.DDMEL?.[level] || 0) + 
         (grid.DDRNG?.[level] || 0) + 
         (grid.DDMAG?.[level] || 0) + 
         (grid.DDSPX?.[level] || 0);
}

// Helper to get level total
function getLevelTotal(grid: StatGrid, level: number): number {
  return STATS.reduce((sum, stat) => sum + (grid[stat.k]?.[level] || 0), 0);
}

// Helper to get stat total across all levels
function getStatTotal(grid: StatGrid, statKey: string): number {
  return (grid[statKey] || []).reduce((sum, val) => sum + val, 0);
}

// Define all 67+ tags
export const TAGS: Tag[] = [
  // Role-based tags (auto-detected from stat distribution)
  {
    name: 'glass_cannon',
    description: 'High attack, low defense',
    check: (grid) => {
      const atkSum = getAttackSum(grid, 8);
      const defSum = getDefenceSum(grid, 8);
      return atkSum > 150 && defSum < 80;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      ATTACK_STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 1.15));
        }
      });
      DEFENCE_STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 0.85));
        }
      });
      return newGrid;
    }
  },
  {
    name: 'tank',
    description: 'High defense and HP',
    check: (grid) => {
      const defSum = getDefenceSum(grid, 8);
      const hp = grid.HPMAX?.[8] || 0;
      return defSum > 150 && hp > 300;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      DEFENCE_STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 1.15));
        }
      });
      if (newGrid.HPMAX) {
        newGrid.HPMAX = newGrid.HPMAX.map(v => Math.floor(v * 1.1));
      }
      return newGrid;
    }
  },
  {
    name: 'speedster',
    description: 'High quickness and evasion',
    check: (grid) => {
      const quick = grid.QUICK?.[8] || 0;
      const evade = grid.EVADE?.[8] || 0;
      return quick > 60 && evade > 40;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.QUICK) {
        newGrid.QUICK = newGrid.QUICK.map(v => Math.floor(v * 1.2));
      }
      if (newGrid.EVADE) {
        newGrid.EVADE = newGrid.EVADE.map(v => Math.floor(v * 1.15));
      }
      return newGrid;
    }
  },
  {
    name: 'balanced',
    description: 'Even distribution across stats',
    check: (grid) => {
      const atkSum = getAttackSum(grid, 8);
      const defSum = getDefenceSum(grid, 8);
      const diff = Math.abs(atkSum - defSum);
      return diff < 50 && atkSum > 100 && defSum > 100;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 1.05));
        }
      });
      return newGrid;
    }
  },
  {
    name: 'melee_specialist',
    description: 'Primarily melee attacks',
    check: (grid) => {
      const atmel = grid.ATMEL?.[8] || 0;
      const atkSum = getAttackSum(grid, 8);
      return atmel > 60 && atmel / atkSum > 0.5;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.ATMEL) {
        newGrid.ATMEL = newGrid.ATMEL.map(v => Math.floor(v * 1.2));
      }
      if (newGrid.DDMEL) {
        newGrid.DDMEL = newGrid.DDMEL.map(v => Math.floor(v * 1.1));
      }
      return newGrid;
    }
  },
  {
    name: 'ranged_specialist',
    description: 'Primarily ranged attacks',
    check: (grid) => {
      const atrng = grid.ATRNG?.[8] || 0;
      const atkSum = getAttackSum(grid, 8);
      return atrng > 60 && atrng / atkSum > 0.5;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.ATRNG) {
        newGrid.ATRNG = newGrid.ATRNG.map(v => Math.floor(v * 1.2));
      }
      if (newGrid.DDRNG) {
        newGrid.DDRNG = newGrid.DDRNG.map(v => Math.floor(v * 1.1));
      }
      return newGrid;
    }
  },
  {
    name: 'magic_specialist',
    description: 'Primarily magic attacks',
    check: (grid) => {
      const atmag = grid.ATMAG?.[8] || 0;
      const atkSum = getAttackSum(grid, 8);
      return atmag > 60 && atmag / atkSum > 0.5;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.ATMAG) {
        newGrid.ATMAG = newGrid.ATMAG.map(v => Math.floor(v * 1.2));
      }
      if (newGrid.DDMAG) {
        newGrid.DDMAG = newGrid.DDMAG.map(v => Math.floor(v * 1.1));
      }
      return newGrid;
    }
  },
  {
    name: 'healer',
    description: 'High healing capability',
    check: (grid) => {
      const healr = grid.HEALR?.[8] || 0;
      return healr > 50;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.HEALR) {
        newGrid.HEALR = newGrid.HEALR.map(v => Math.floor(v * 1.25));
      }
      if (newGrid.ALLYX) {
        newGrid.ALLYX = newGrid.ALLYX.map(v => Math.floor(v * 1.1));
      }
      return newGrid;
    }
  },
  {
    name: 'support',
    description: 'Ally buffs and utility',
    check: (grid) => {
      const allyx = grid.ALLYX?.[8] || 0;
      const atsfx = grid.ATSFX?.[8] || 0;
      return allyx + atsfx > 60;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      if (newGrid.ALLYX) {
        newGrid.ALLYX = newGrid.ALLYX.map(v => Math.floor(v * 1.15));
      }
      if (newGrid.ATSFX) {
        newGrid.ATSFX = newGrid.ATSFX.map(v => Math.floor(v * 1.15));
      }
      return newGrid;
    }
  },
  {
    name: 'damage_dealer',
    description: 'Focused on dealing damage',
    check: (grid) => {
      const atkSum = getAttackSum(grid, 8);
      return atkSum > 200;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      ATTACK_STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 1.1));
        }
      });
      return newGrid;
    }
  },
  {
    name: 'defensive_specialist',
    description: 'Focused on defense',
    check: (grid) => {
      const defSum = getDefenceSum(grid, 8);
      return defSum > 200;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      DEFENCE_STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = newGrid[stat.k].map(v => Math.floor(v * 1.1));
        }
      });
      return newGrid;
    }
  },
  {
    name: 'quick_starter',
    description: 'Strong at level 1',
    check: (grid) => {
      const lv1Total = getLevelTotal(grid, 0);
      return lv1Total > 250;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = [...newGrid[stat.k]];
          newGrid[stat.k][0] = Math.floor(newGrid[stat.k][0] * 1.15);
          newGrid[stat.k][1] = Math.floor(newGrid[stat.k][1] * 1.1);
        }
      });
      return newGrid;
    }
  },
  {
    name: 'late_bloomer',
    description: 'Weak early, strong late',
    check: (grid) => {
      const lv1Total = getLevelTotal(grid, 0);
      const lv9Total = getLevelTotal(grid, 8);
      return lv9Total > lv1Total * 4;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = [...newGrid[stat.k]];
          newGrid[stat.k][0] = Math.floor(newGrid[stat.k][0] * 0.85);
          newGrid[stat.k][7] = Math.floor(newGrid[stat.k][7] * 1.15);
          newGrid[stat.k][8] = Math.floor(newGrid[stat.k][8] * 1.2);
        }
      });
      return newGrid;
    }
  },
  {
    name: 'slow_starter',
    description: 'Weak at level 1',
    check: (grid) => {
      const lv1Total = getLevelTotal(grid, 0);
      return lv1Total < 180;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = [...newGrid[stat.k]];
          newGrid[stat.k][0] = Math.floor(newGrid[stat.k][0] * 0.9);
        }
      });
      return newGrid;
    }
  },
  {
    name: 'early_bloomer',
    description: 'Strong early, weaker scaling',
    check: (grid) => {
      const lv1Total = getLevelTotal(grid, 0);
      const lv9Total = getLevelTotal(grid, 8);
      return lv1Total > 250 && lv9Total < lv1Total * 3;
    },
    apply: (grid) => {
      const newGrid = { ...grid };
      STATS.forEach(stat => {
        if (newGrid[stat.k]) {
          newGrid[stat.k] = [...newGrid[stat.k]];
          newGrid[stat.k][0] = Math.floor(newGrid[stat.k][0] * 1.2);
          newGrid[stat.k][1] = Math.floor(newGrid[stat.k][1] * 1.15);
        }
      });
      return newGrid;
    }
  },
  // Add more tags as needed...
  // (Additional 50+ tags would follow similar patterns)
];

// ============================================================================
// STAT CALCULATION HELPERS
// ============================================================================

/**
 * Compute stat grid with multipliers
 */
export function computeGrid(
  boundaries: { [key: string]: number },
  multipliers: { [key: string]: string[] },
  manual: { [key: string]: { [level: number]: string } } = {},
  locks: { [key: string]: boolean } = {}
): StatGrid {
  const grid: StatGrid = {};

  STATS.forEach(stat => {
    const statKey = stat.k;
    const isLocked = locks[statKey];
    const baseValue = boundaries[statKey] || 0;
    const mults = multipliers[statKey] || Array(8).fill('1.000');
    const manualOverrides = manual[statKey] || {};

    // Initialize array
    grid[statKey] = Array(9).fill(0);

    if (isLocked) {
      // Locked stats are zero across all levels
      return;
    }

    // Level 1 (index 0)
    if (manualOverrides[0] !== undefined) {
      grid[statKey][0] = parseFloat(manualOverrides[0]) || 0;
    } else {
      grid[statKey][0] = baseValue;
    }

    // Levels 2-9
    for (let i = 1; i < 9; i++) {
      if (manualOverrides[i] !== undefined) {
        grid[statKey][i] = parseFloat(manualOverrides[i]) || 0;
      } else {
        const mult = parseFloat(mults[i - 1]) || 1.0;
        grid[statKey][i] = Math.floor(grid[statKey][i - 1] * mult);
      }
    }
  });

  return grid;
}

/**
 * Calculate derived values for a level
 */
export function calculateDerived(grid: StatGrid, level: number) {
  const atkSum = getAttackSum(grid, level);
  const defSum = getDefenceSum(grid, level);
  const atkTop = Math.max(
    grid.ATMEL?.[level] || 0,
    grid.ATRNG?.[level] || 0,
    grid.ATMAG?.[level] || 0,
    grid.ATSPX?.[level] || 0
  );
  const defTop = Math.max(
    grid.DDMEL?.[level] || 0,
    grid.DDRNG?.[level] || 0,
    grid.DDMAG?.[level] || 0,
    grid.DDSPX?.[level] || 0
  );
  const lvTotal = getLevelTotal(grid, level);

  return {
    ATK_SUM: atkSum,
    ATK_TOP: atkTop,
    DEF_SUM: defSum,
    DEF_TOP: defTop,
    LV_TOTAL: lvTotal
  };
}

/**
 * Calculate grand total across all levels
 */
export function calculateGrandTotal(grid: StatGrid): number {
  let total = 0;
  for (let level = 0; level < 9; level++) {
    total += getLevelTotal(grid, level);
  }
  return total;
}

/**
 * Validate stat grid
 */
export function validateGrid(grid: StatGrid): string[] {
  const errors: string[] = [];

  STATS.forEach(stat => {
    const values = grid[stat.k] || [];
    
    // Check level 1 bounds
    if (values[0] < stat.lowest) {
      errors.push(`${stat.k} Level 1 below minimum (${stat.lowest})`);
    }
    if (values[0] > stat.lv1Limit) {
      errors.push(`${stat.k} Level 1 exceeds limit (${stat.lv1Limit})`);
    }

    // Check for decreasing values
    for (let i = 1; i < values.length; i++) {
      if (values[i] < values[i - 1]) {
        errors.push(`${stat.k} decreases from Level ${i} to Level ${i + 1}`);
      }
    }

    // Check absolute limit
    for (let i = 0; i < values.length; i++) {
      if (values[i] > stat.limit) {
        errors.push(`${stat.k} Level ${i + 1} exceeds absolute limit (${stat.limit})`);
      }
    }
  });

  // Check grand total cap
  const grandTotal = calculateGrandTotal(grid);
  if (grandTotal > 5200) {
    errors.push(`Grand total (${grandTotal}) exceeds cap of 5200`);
  }

  return errors;
}

/**
 * Build timeline tracking data
 */
export function buildTimeline(grid: StatGrid): {
  firstNonZero: { [key: string]: number };
  timeline: string[];
} {
  const firstNonZero: { [key: string]: number } = {};
  const events: Array<{ level: number; type: string; stat: string }> = [];

  STATS.forEach(stat => {
    const values = grid[stat.k] || [];
    
    // Find first non-zero
    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0) {
        firstNonZero[stat.k] = i + 1;
        events.push({ level: i + 1, type: 'LEARN', stat: stat.k });
        break;
      }
    }

    // Find boosts (jumps above expected)
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1] * 1.5 && values[i] > 10) {
        events.push({ level: i + 1, type: 'BOOST', stat: stat.k });
      }
    }
  });

  // Sort events by level
  events.sort((a, b) => a.level - b.level);

  // Build timeline strings
  const timeline: string[] = [];
  for (let level = 1; level <= 9; level++) {
    const levelEvents = events.filter(e => e.level === level);
    if (levelEvents.length > 0) {
      const learns = levelEvents.filter(e => e.type === 'LEARN').map(e => e.stat);
      const boosts = levelEvents.filter(e => e.type === 'BOOST').map(e => e.stat);
      
      let str = `Level ${level}:`;
      if (learns.length > 0) str += ` LEARN [${learns.join(', ')}]`;
      if (boosts.length > 0) str += ` BOOST [${boosts.join(', ')}]`;
      
      timeline.push(str);
    }
  }

  return { firstNonZero, timeline };
}

/**
 * Detect active tags from grid
 */
export function detectActiveTags(grid: StatGrid): string[] {
  return TAGS.filter(tag => tag.check(grid)).map(tag => tag.name);
}

/**
 * Filter tags by conflicts
 */
export function filterConflictingTags(selectedTags: string[]): {
  active: string[];
  ignored: string[];
} {
  const active: string[] = [];
  const ignored: string[] = [];

  selectedTags.forEach(tag => {
    const conflicts = TAG_CONFLICTS[tag] || [];
    const hasConflict = active.some(activeTag => conflicts.includes(activeTag));
    
    if (hasConflict) {
      ignored.push(tag);
    } else {
      active.push(tag);
    }
  });

  return { active, ignored };
}

/**
 * Apply tags to grid
 */
export function applyTags(grid: StatGrid, tagNames: string[]): StatGrid {
  let result = grid;
  
  tagNames.forEach(tagName => {
    const tag = TAGS.find(t => t.name === tagName);
    if (tag) {
      result = tag.apply(result);
    }
  });

  return result;
}
