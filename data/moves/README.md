# Moves

This directory contains move/ability definitions for characters.

## Purpose

Moves are the actions characters can perform in battle. Each move has specific targeting, effects, and multipliers based on tags and environmental conditions.

## File Format

All move files must be in **JSON format** and validate against `/data/schemas/move-schema.json`.

## Move Structure

Each move requires:
- **id**: Unique alphanumeric identifier
- **name**: Player-facing display name
- **description**: What the move does
- **type**: Category from `/data/pools/move-types.json`
- **target**: Who/what is affected
- **learned_at_level**: When character learns this (1-10)
- **effect_algorithm**: Mathematical formula for damage/effect calculation

## Move Types

From `/data/pools/move-types.json`:
- Melee Attack
- Ranged Attack  
- Magic Attack
- Status Application
- Heal
- Buff
- Debuff
- Trap/Hazard
- Mixed

## Target Types

- **enemy**: Single enemy
- **enemies_in_range**: Multiple enemies (specify count)
- **random_enemies**: Random selection (specify count)
- **ally**: Single ally
- **self**: Caster only
- **environment**: Affects battlefield
- **all**: All combatants

## Multipliers

### Target MaTs (Multiplier Affecting Tags)
Define how effective the move is against entities with specific tags.

Example:
```json
"target_mats": [
  {
    "tag": "undead",
    "multiplier": 1.5
  },
  {
    "tag": "construct", 
    "multiplier": 0.5
  }
]
```

### Target MaECs (Environmental Conditions)
Define how environmental conditions affect the move.

Example:
```json
"target_maecs": [
  {
    "condition": "rain",
    "multiplier": 0.8
  },
  {
    "condition": "sacred_ground",
    "multiplier": 1.3
  }
]
```

## Effect Algorithms

Effect algorithms use character stats and can reference:
- **Attacker stats**: MLA, RGA, MAA, SPA, ACC, etc.
- **Target stats**: MLD, RGD, MAD, SPD (defense), EVA, etc.
- **Multipliers**: Applied from MaT and MaEC arrays

Example:
```
damage = (MLA * 1.5) + (ACC * 0.5) - (target.MLD * 0.7)
```

## Learned at Level (LaL)

- **Level 1**: Initial 4 moves every character starts with
- **Levels 2-10**: Additional moves learned through progression

## Validation

Before committing move files:
1. Validate against `/data/schemas/move-schema.json`
2. Ensure move type exists in `/data/pools/move-types.json`
3. Verify all tags exist in `/data/pools/tags.json`
4. Verify all conditions exist in `/data/pools/environmental-conditions.json`
5. Test effect algorithm for edge cases

See `/docs/reference/data-validation-pools.md` for complete documentation.
