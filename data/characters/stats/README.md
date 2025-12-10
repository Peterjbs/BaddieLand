# Character Statistics

This directory contains initial character statistics and attributes.

## Purpose
- Define base stats for all characters
- Store character progression data
- Maintain stat formulas and calculations
- Document character classes and types

## File Format
Character stats should be stored in **JSON format** for easy parsing and modification. Use `.json` extension for all character stat files.

All character files must validate against `/data/schemas/character-schema.json`.

## File Types

### Character Definition Files
Main character data including name, ID, species, roles, tags, and move list.

**Example:** `example-character.json`

### Level Statistics Files  
Per-level stat progressions for characters (levels 1-10).

**Example:** `example-character-levels.json`

## Required Statistics (Per Level)

Each level (1-10) must define these 17 stats (range 1-100):
- **HP**: Health Points
- **BBS**: Bounce Back Score  
- **SPD**: Speed
- **EVA**: Evasiveness
- **ACC**: Accuracy
- **MLA**: Melee Attack value
- **RGA**: Ranged Attack value
- **MAA**: Magic Attack value
- **SPA**: Special Attack value
- **MLD**: Melee Defense value
- **RGD**: Ranged Defense value
- **MAD**: Magic Defense value
- **SPD (Defense)**: Special Defense value
- **INT**: Intuition
- **AGG**: Aggression
- **CRG**: Courage
- **XPA**: XP Accumulated (integer)
- **XPT**: XP Threshold to next level (integer)

## Validation

Before committing character files:
1. Validate against `/data/schemas/character-schema.json`
2. Ensure all referenced pools exist in `/data/pools/`
3. Verify move IDs exist in `/data/moves/`
4. Check global_id is unique (1-100)

See `/docs/reference/data-validation-pools.md` for complete documentation.
