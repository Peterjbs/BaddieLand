import { Character, LevelStat } from './firestore-helpers';

// Default character for new character creation
export const DEFAULT_CHARACTER: Omit<Character, 'id'> = {
  name: 'New Character',
  age: 0,
  species: 'human',
  gang: 'GGG',
  roles: {
    primary: 'bruiser',
  },
  growthCurve: 'steady',
  matTags: ['living', 'sentient'],
  move_list: [],
};

// Default level stat template
export const DEFAULT_LEVEL_STAT: LevelStat = {
  level: 1,
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
  xpa: 0,
  xpt: 100,
};

// Growth curve formulas
export const GROWTH_CURVE_FORMULAS: Record<string, (level: number) => number> = {
  steady: (level) => 40 + level * 6,
  strong_starter: (level) => 60 + level * 4,
  quick_learner: (level) => 35 + level * 7,
  late_bloomer: (level) => 30 + level * 8,
  slow: (level) => 45 + level * 5,
  key_levels: (level) => [2, 5, 8].includes(level) ? 50 + level * 8 : 40 + level * 5,
};
