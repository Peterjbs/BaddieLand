# Data Schemas

This directory contains JSON schemas for validating game data structures.

## Purpose

Schemas define the required structure and validation rules for all game entities. Use these schemas to validate character files, move definitions, and level statistics before committing to the repository.

## Schema Files

- **`character-schema.json`** - Character entity structure validation
- **`move-schema.json`** - Move/ability entity structure validation  
- **`level-stats-schema.json`** - Level-specific statistics structure validation

## Usage

### Validating JSON Files

Use any JSON Schema validator (Draft 7) to validate your data files:

```bash
# Example using ajv-cli
ajv validate -s character-schema.json -d ../characters/stats/my-character.json
```

### Online Validators

You can also use online tools:
- [jsonschemavalidator.net](https://www.jsonschemavalidator.net/)
- Paste schema and data to validate

## Schema Relationships

- **Character Schema** references:
  - Role IDs from `/data/pools/roles.json`
  - Growth curve IDs from `/data/pools/growth-curves.json`
  - Tag IDs from `/data/pools/tags.json`
  - Species IDs from `/data/pools/species.json`
  
- **Move Schema** references:
  - Move type IDs from `/data/pools/move-types.json`
  - Tag IDs from `/data/pools/tags.json`
  - Environmental condition IDs from `/data/pools/environmental-conditions.json`

- **Level Stats Schema** validates:
  - All stat values are integers 1-100
  - Level is 1-10
  - XP values are non-negative integers

## Integration

Agents and build tools should validate all data files against these schemas before:
- Committing new characters
- Creating new moves
- Generating level progression data
- Building game assets

See `/docs/reference/data-validation-pools.md` for complete data model documentation.
