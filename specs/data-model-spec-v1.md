# BaddieLand RPG - Data Model Specification v1.0

## Document Purpose

This specification defines the complete data model for BaddieLand, a battle-based RPG game. All game entities, mechanics, and content must conform to this model.

## Quick Reference

### Data Locations

- **Validation Pools**: `/data/pools/` - Defines valid values for all game data
- **JSON Schemas**: `/data/schemas/` - Structural validation for entities
- **Reference Docs**: `/docs/reference/data-validation-pools.md` - Comprehensive guide
- **Example Data**: `/data/characters/stats/example-*.json`, `/data/moves/example-*.json`

### Core Pools (Must Reference These)

| Pool | Count | File | Purpose |
|------|-------|------|---------|
| Roles | 12 | `roles.json` | Character archetypes (Tank, Assassin, etc.) |
| Growth Curves | 6 | `growth-curves.json` | Stat progression patterns |
| States | 21 | `states.json` | Battle conditions (Poisoned, Stunned, etc.) |
| MaT Tags | 25 | `tags.json` | Entity properties & multipliers |
| MaEC | 15 | `environmental-conditions.json` | Battlefield conditions |
| Species | 17+ | `species.json` | Visual asset groups |
| Move Types | 9 | `move-types.json` | Ability categories |

## Character Entity Structure

### Required Fields

```json
{
  "name": "string - Character name",
  "global_id": "integer 1-100 - Unique ID",
  "tribe": "string - Group affiliation",
  "species": "string - From species pool",
  "roles": {
    "primary": "string - From roles pool (required)",
    "secondary": "string - From roles pool (optional)",
    "tertiary": "string - From roles pool (optional)"
  },
  "growth_curve": "string - From growth curves pool",
  "mat_list": ["array of strings - From tags pool"],
  "move_list": ["array of strings - Move IDs"]
}
```

### Level Statistics (Levels 1-10)

Each character requires stats for all 10 levels:

**Combat Stats (Range 1-100):**
- HP, BBS, SPD, EVA, ACC
- MLA, RGA, MAA, SPA (Attack values)
- MLD, RGD, MAD, SPD_DEF (Defense values)
- INT, AGG, CRG (Behavioral stats)

**Progression Stats:**
- XPA (XP Accumulated) - Integer, no max
- XPT (XP Threshold) - Integer, no max

## Move Entity Structure

### Required Fields

```json
{
  "id": "string - Unique move identifier",
  "name": "string - Display name",
  "description": "string - Effect description",
  "type": "string - From move types pool",
  "target": {
    "type": "enemy|allies_in_range|random_enemies|ally|self|environment|all",
    "count": "integer - If applicable"
  },
  "learned_at_level": "integer 1-10",
  "effect_algorithm": "string - Damage/effect formula"
}
```

### Optional Multipliers

```json
{
  "target_mats": [
    {
      "tag": "string - From tags pool",
      "multiplier": "number - Effect modifier"
    }
  ],
  "target_maecs": [
    {
      "condition": "string - From environmental conditions pool",
      "multiplier": "number - Effect modifier"
    }
  ]
}
```

## Validation Workflow

1. **Create/Edit Entity** → Reference pools for valid values
2. **Validate Structure** → Run against JSON schema
3. **Validate References** → Ensure pool values exist
4. **Test Edge Cases** → Verify formulas and ranges
5. **Commit** → Add to repository

## Effect Algorithms

Formulas can reference:

**Attacker Stats:**
- MLA, RGA, MAA, SPA (Attack)
- ACC (Accuracy)
- SPD (Speed)
- INT, AGG, CRG (Behavioral)

**Target Stats:**
- MLD, RGD, MAD, SPD_DEF (Defense)
- EVA (Evasion)
- HP, BBS (Survivability)

**Operators:**
- Standard math: `+`, `-`, `*`, `/`
- Parentheses for grouping
- Decimal multipliers allowed

**Example:**
```
damage = (MLA * 1.5) + (ACC * 0.5) - (target.MLD * 0.7)
```

## Tag & Condition System

### MaT (Multiplier Affecting Tags)

**Categories:**
- Nature: living, undead, construct, magic, feral, sentient, mindless
- Physical: flying, no_legs, non_corporeal, saah_small, saah_big
- Elemental: fire, water, air, earth, electric, plant, ice
- Material: metallic, wooden
- Alignment: holy, dark, shadow
- Other: blood

### MaEC (Environmental Conditions)

**Weather:** sunlight, moonlight, rain, heavy_rain, wind, fog, heatwave, blizzard, sandstorm

**Terrain:** urban, nature, water_terrain, sacred_ground, indoors, underground

## Roles Detailed

| Role | Primary Function | Stat Priority |
|------|-----------------|---------------|
| Tank | Damage absorption | HP, MLD, RGD, BBS |
| Bruiser | Sustained melee | MLA, HP, MLD |
| Big Hitter | Burst damage | MLA/RGA/MAA, slow SPD |
| Assassin | Single target elimination | SPD, ACC, MLA/RGA, EVA |
| Fat Trimmer | AoE damage | MAA/RGA, multi-target moves |
| Healer | HP restoration | MAA, INT, ally-targeting |
| Ally | Buffing teammates | INT, support moves |
| Debuffer | Enemy penalties | MAA, INT, status moves |
| Controller | Battlefield control | INT, SPD, status moves |
| Survivor | Evasion/stalling | EVA, BBS, SPD |
| Sniper | Long range precision | RGA, ACC, low MLD |
| Looter | Resource generation | SPD, special abilities |

## Growth Curves Detailed

| Curve | Characteristic | Best For |
|-------|---------------|----------|
| Steady | Consistent linear growth | Balanced characters |
| Strong Starter | High base, slow growth | Early game dominance |
| Quick Learner | Fast leveling | Rapid progression |
| Late Bloomer | Weak early, strong late | Endgame specialists |
| Slow | Expensive leveling | Powerful but rare level-ups |
| Key Levels | Milestone spikes | Story-driven progression |

## Species Visual Groups

Used for asset generation consistency:

- **Undead**: Vampire/Dhampir, Skeleton, Reanimated, Spirits
- **Elemental**: Stone, Ice, Fire, Air, Water, Blood, Plant, Slime, etc.
- **Hybrid**: Werewolf, Cat, Lion, Fox, Horse, Minotaur, Lizardwoman, etc.
- **Artificial**: Constructs, Golems, Statues, Gargoyles, Mimics
- **Fae**: Small Fae (Pixie, Goblin), High Fae (Elf, Drow, Dryad)
- **Giant**: Ogre, Troll, Giant, Fomor
- **Aquatic**: Merfolk, Siren
- **Other**: Dwarf, Hags, Witches, Reptilian, Harpy, Angel, Poltergeist

## Versioning

- **Version**: 1.0
- **Date**: 2025-12-10
- **Status**: Active
- **Next Review**: When extending to 100+ characters

## Change Management

When modifying this specification:

1. Update pool JSON files
2. Update corresponding schemas
3. Update this specification document
4. Update `/docs/reference/data-validation-pools.md`
5. Validate existing characters/moves still conform
6. Version bump and document changes

---

**For detailed descriptions and complete listings, see:**
`/docs/reference/data-validation-pools.md`
