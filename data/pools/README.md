# Data Pools

This directory contains validation pools for all game data entities.

## Purpose

Data pools define the valid values and options for character creation, move generation, and game mechanics. All game data must reference values from these pools to ensure consistency and enable proper validation.

## Pool Files

- **`roles.json`** - 12 character role archetypes (Tank, Bruiser, Assassin, etc.)
- **`growth-curves.json`** - 6 statistical progression trajectories
- **`states.json`** - 21 temporary battle conditions (Poisoned, Stunned, etc.)
- **`tags.json`** - 25 MaT (Multiplier Affecting Tags) for entity properties
- **`environmental-conditions.json`** - 15 MaEC (battlefield conditions)
- **`species.json`** - 17+ species groups for visual asset generation
- **`move-types.json`** - 9 move/ability categories

## Usage

When creating characters or moves:

1. Reference these pool files for valid values
2. Use exact IDs/names as specified in the pools
3. Validate against the schemas in `/data/schemas/`
4. Consult `/docs/reference/data-validation-pools.md` for detailed descriptions

## Data Format

All pool files use JSON format with the following structure:

```json
{
  "pool_name": {
    "description": "Pool description",
    "values": [
      {
        "id": "unique_identifier",
        "name": "Display Name",
        "description": "Detailed description"
      }
    ]
  }
}
```

## Validation

Do not modify pool files without updating:
- Corresponding JSON schemas in `/data/schemas/`
- Reference documentation in `/docs/reference/`
- Any existing characters/moves that reference changed values
