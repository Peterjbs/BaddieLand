# Data Validation and Pools Reference

This document provides comprehensive reference for all data validation pools and schemas used in BaddieLand RPG.

## Table of Contents

1. [Roles](#roles)
2. [Growth Curves](#growth-curves)
3. [States](#states)
4. [Tags (MaT)](#tags-mat)
5. [Environmental Conditions (MaEC)](#environmental-conditions-maec)
6. [Species](#species)
7. [Move Types](#move-types)
8. [Character Data Structure](#character-data-structure)
9. [Move Data Structure](#move-data-structure)
10. [Level Statistics](#level-statistics)

## Roles

Primary archetypes determining function and utility. Each character must have a primary role and may have secondary/tertiary roles.

**Available Roles:**
- **Tank**: Absorbs heavy damage and obstructs enemy movement
- **Bruiser**: Durable fighter capable of sustaining and dealing moderate melee damage
- **Big Hitter**: Delivers massive burst damage, typically with slow execution or recovery
- **Assassin**: High speed and precision unit focused on eliminating single targets rapidly
- **Fat Trimmer**: Area of Effect (AoE) specialist focused on damaging multiple grouped enemies
- **Healer**: Restores Health Points (HP) to allies or self
- **Ally**: Provides statistical buffs and enhancements to teammates
- **Debuffer**: Applies negative status effects or statistical penalties to enemies
- **Controller**: Manipulates battlefield positioning, terrain, or enemy action economy (stuns/freezes)
- **Survivor**: Focuses on evasion, mitigation, and stalling to remain active in battle
- **Sniper**: Engages targets from extreme range with high accuracy and low physical defense
- **Looter**: Steals items or currency, generates resources, or disrupts enemy economy

**Data Location:** `/data/pools/roles.json`

## Growth Curves

Trajectories defining statistical progression and experience requirements.

**Available Curves:**
- **Steady**: Linear, consistent stat gain and experience thresholds across all levels
- **Strong Starter**: High initial base stats with minimal gain per level
- **Quick Learner**: Lower experience thresholds required to reach subsequent levels
- **Late Bloomer**: Low initial stats with significant multiplier spikes at high levels (7-10)
- **Slow**: Higher experience thresholds requiring more accumulation per level
- **Key Levels**: Moderate growth with specific large stat jumps at pre-defined milestones (e.g., Lvl 5, Lvl 10)

**Data Location:** `/data/pools/growth-curves.json`

## States

Temporary conditions applied to entities during battle.

**Available States (21 total):**
- **Poisoned**: Recurring damage over time based on biological susceptibility
- **Bleeding**: Damage triggered by movement or physical exertion
- **Burning**: Recurring fire damage
- **Regenerating**: Passive HP recovery over time
- **Rooted**: Inability to change grid position
- **Stunned**: Complete inability to take actions or move
- **Slowed**: Reduction in turn speed or movement range
- **Hasted**: Increase in turn speed or movement range
- **Feared**: Forced movement away from a source or inability to advance
- **Charmed**: Forced action to assist the source or inability to attack the source
- **Blinded**: Significant reduction in accuracy or vision range
- **Silenced**: Inability to use Magic-type abilities
- **Invisible**: Untargetable by direct locking attacks; visible only to specific detection
- **Invulnerable**: Immunity to all forms of damage
- **Taunted**: Forced targeting of a specific entity
- **Wet**: Covered in liquid; interacts with temperature or electrical effects
- **Frozen**: Encased in ice; immobile and often brittle
- **Oil-Covered**: Covered in flammable substance
- **Confused**: Actions have random targets or outcomes
- **Asleep**: Inability to act until damaged or duration expires
- **Cursed**: Susceptibility to misfortunate RNG outcomes (crit fails)
- **Marked**: Targeted entity takes increased damage from all sources

**Data Location:** `/data/pools/states.json`

## Tags (MaT)

Multiplier Affecting Tags - Descriptors defining fundamental nature and specific multipliers. Total of 25 tags.

**Categories:**

### Nature Tags
- **living**: Biological entity
- **undead**: Reanimated or necrotic entity
- **construct**: Artificial or inorganic entity
- **magic**: Entity comprised of or heavily reliant on arcane energy
- **feral**: Wild, untamed, or animalistic nature
- **sentient**: Human-level intelligence or higher
- **mindless**: Lacking higher thought processes

### Physical Tags
- **flying**: Entity hovers or uses wings; not grounded
- **no_legs**: Entity moves via slithering, floating, or swimming; no footfalls
- **non_corporeal**: Entity lacks a solid physical form
- **saah_small**: Significantly Below Average Height - Smaller hitbox, harder to hit
- **saah_big**: Significantly Above Average Height - Larger hitbox, immune to knockback from smaller units

### Elemental Tags
- **fire**: Affinity with heat/magma
- **water**: Affinity with liquid/ice
- **air**: Affinity with wind/gas
- **earth**: Affinity with stone/mud/solid matter
- **electric**: Affinity with lightning/energy
- **plant**: Affinity with flora/nature
- **ice**: Affinity with cold/frost

### Material Tags
- **metallic**: Made of metal
- **wooden**: Made of wood

### Alignment Tags
- **holy**: Divine or sacred alignment
- **dark**: Cursed or necrotic alignment
- **shadow**: Affinity with darkness/void

### Other Tags
- **blood**: Affinity with vital fluids

**Data Location:** `/data/pools/tags.json`

## Environmental Conditions (MaEC)

Multiplier Affecting Environmental Conditions - Global or local variables defining the battlefield context.

**Available Conditions (15 total):**
- **Sunlight**: Direct exposure to day star
- **Moonlight**: Direct exposure to night satellite
- **Rain**: Falling liquid precipitation
- **Heavy Rain**: Torrential liquid precipitation
- **Wind**: Strong air currents
- **Fog**: Low visibility atmospheric suspension
- **Urban**: Paved, concrete, man-made structure environment
- **Nature**: Organic, soil, forest, or bog environment
- **Water (Terrain)**: Deep water or submerged environment
- **Sacred Ground**: Consecrated or holy area
- **Heatwave**: Extreme high temperature
- **Blizzard**: Extreme low temperature with snow
- **Sandstorm**: Abrasive particulate wind
- **Indoors**: Enclosed space protected from weather
- **Underground**: Subterranean environment

**Data Location:** `/data/pools/environmental-conditions.json`

## Species

Visual & Vibe Pool - Grouped by visual interchangeability for Asset Generation.

**Species Groups (17+ groups):**
1. **Vampire / Dhampir**: Pale, elegant, fangs, gothic or tactical attire
2. **Skeleton**: Visible bones, empty sockets, armor or streetwear
3. **Reanimated**: Decaying flesh, grey/green skin, ragged clothing
4. **Spirits**: Translucent, glowing, floating, spectral
5. **Elementals**: Body made entirely of specified substance
6. **Animal Hybrids**: Anthropomorphic blends
7. **Constructs**: Artificial, rigid, mechanical
8. **Small Fae**: Diminutive, magical
9. **High Fae**: Tall, elegant, angular
10. **Hags & Witches**: Mystical practitioners
11. **Giants**: Oversized, brutish
12. **Dwarf**: Short, stout, broad
13. **Merfolk**: Aquatic humanoids
14. **Reptilian**: Snake-based features
15. **Preserved**: Bog bodies
16. **Harpy / Angel**: Winged humanoids
17. **Poltergeist**: Electronic/glitch aesthetic

**Data Location:** `/data/pools/species.json`

## Move Types

Categories for Move Generation.

**Available Types (9 total):**
- **Melee Attack**: Physical contact damage
- **Ranged Attack**: Projectile or thrown weapon damage
- **Magic Attack**: Spell or energy damage
- **Status Application**: Applies a State (e.g., Poison, Stun)
- **Heal**: Restores HP
- **Buff**: Improves Stats
- **Debuff**: Reduces Stats
- **Trap/Hazard**: Creates an environmental effect on the grid
- **Mixed**: Combination of types

**Data Location:** `/data/pools/move-types.json`

## Character Data Structure

Required fields for each character entity:

- **name** (string): Alphanumeric identifier
- **global_id** (integer 1-100): Numeric identifier
- **tribe** (string): Group affiliation
- **species** (string): Primary classification
- **subspecies** (string, optional): Specific variation
- **age** (integer/string): Age descriptor
- **roles** (object): Primary/secondary/tertiary role allocations
- **weapon_item** (string, optional): Physical prop
- **growth_curve** (string): Progression trajectory type
- **brand_vibe** (string, optional): Personality/aesthetic summary
- **specific_visuals** (string, optional): Visual generation overrides
- **mat_list** (array): Collection of active MaT tags
- **move_list** (array): Array of move IDs

**Schema Location:** `/data/schemas/character-schema.json`

## Move Data Structure

Required fields for each move entity:

- **id** (string): Alphanumeric identifier
- **name** (string): Player-facing name
- **description** (string): Effect description
- **type** (string): Move type from pool
- **target** (object): Target specification (type, count)
- **learned_at_level** (integer 1-10): LaL value (1 for initial moves)
- **target_mats** (array, optional): MaT multipliers
- **target_maecs** (array, optional): MaEC multipliers
- **effect_algorithm** (string): Mathematical formula

**Schema Location:** `/data/schemas/move-schema.json`

## Level Statistics

Individual metrics per level (Range 1-100 unless noted):

- **level** (1-10): Character level
- **hp**: Health Points
- **bbs**: Bounce Back Score
- **spd**: Speed
- **eva**: Evasiveness
- **acc**: Accuracy
- **mla**: Melee Attack value
- **rga**: Ranged Attack value
- **maa**: Magic Attack value
- **spa**: Special Attack value
- **mld**: Melee Defense value
- **rgd**: Ranged Defense value
- **mad**: Magic Defense value
- **spd_def**: Special Defense value
- **int**: Intuition
- **agg**: Aggression
- **crg**: Courage
- **xpa**: XP Accumulated (integer, no max)
- **xpt**: XP Threshold (integer, no max)

**Schema Location:** `/data/schemas/level-stats-schema.json`

## Validation

All JSON files should validate against their respective schemas. Use standard JSON schema validators to ensure data integrity before committing character or move data.

## Usage Guidelines

1. Always reference pool files when creating new characters or moves
2. Validate all data against schemas before committing
3. Ensure MaT and MaEC references are valid pool values
4. Keep move learned_at_level values between 1-10
5. Character global_id must be unique (1-100)
6. Stats must stay within 1-100 range
