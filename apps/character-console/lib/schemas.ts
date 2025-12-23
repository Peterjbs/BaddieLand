import { z } from 'zod';

// Move schema
export const moveSchema = z.object({
  id: z.string().min(1, 'Move ID is required'),
  name: z.string().min(1, 'Move name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Type is required'),
  target: z.object({
    type: z.string(),
    count: z.number().optional(),
  }),
  learned_at_level: z.number().min(1).max(10),
  effect_algorithm: z.string().min(1, 'Effect algorithm is required'),
  target_mats: z.array(z.object({
    tag: z.string(),
    multiplier: z.number(),
  })).optional(),
  target_maecs: z.array(z.object({
    condition: z.string(),
    multiplier: z.number(),
  })).optional(),
});

export type Move = z.infer<typeof moveSchema>;

// Level stats schema
export const levelStatsSchema = z.object({
  level: z.number().min(1).max(10),
  hp: z.number().min(1).max(100),
  bbs: z.number().min(1).max(100),
  spd: z.number().min(1).max(100),
  eva: z.number().min(1).max(100),
  acc: z.number().min(1).max(100),
  mla: z.number().min(1).max(100),
  rga: z.number().min(1).max(100),
  maa: z.number().min(1).max(100),
  spa: z.number().min(1).max(100),
  mld: z.number().min(1).max(100),
  rgd: z.number().min(1).max(100),
  mad: z.number().min(1).max(100),
  spd_def: z.number().min(1).max(100),
  int: z.number().min(1).max(100),
  agg: z.number().min(1).max(100),
  crg: z.number().min(1).max(100),
  xpa: z.number().min(0),
  xpt: z.number().min(0),
});

export type LevelStats = z.infer<typeof levelStatsSchema>;

// Visual description schema
export const visualDescriptionSchema = z.object({
  body_and_skin: z.string().optional(),
  hair: z.string().optional(),
  clothing: z.string().optional(),
  distinguishing_features: z.string().optional(),
  weapon_item: z.string().optional(),
});

export type VisualDescription = z.infer<typeof visualDescriptionSchema>;

// Character schema
export const characterSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  age: z.number().positive('Age must be positive').optional(),
  gang: z.enum(['GGG', 'MMM', 'BBB', 'PPP']),
  species: z.string().min(1, 'Species is required'),
  subspecies: z.string().optional(),
  specific_visuals: z.string().optional(),
  roles: z.object({
    primary: z.string().min(1, 'Primary role is required'),
    secondary: z.string().optional(),
    tertiary: z.string().optional(),
  }),
  growthCurve: z.string().min(1, 'Growth curve is required'),
  weaponItem: z.string().optional(),
  matTags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  overview: z.string().optional(),
  visual_description: visualDescriptionSchema.optional(),
  vibe: z.string().optional(),
  level_stats: z.array(levelStatsSchema).length(10, 'Must have exactly 10 levels').optional(),
  moves: z.array(moveSchema).max(10, 'Maximum 10 moves allowed').optional(),
  activeAvatar: z.string().optional(),
  unapprovedAvatars: z.array(z.string()).optional(),
  rejectedAvatars: z.array(z.string()).optional(),
  latestSpriteSheet: z.object({
    path: z.string(),
    templateType: z.string(),
    metadata: z.any(),
  }).optional(),
});

export type Character = z.infer<typeof characterSchema>;
