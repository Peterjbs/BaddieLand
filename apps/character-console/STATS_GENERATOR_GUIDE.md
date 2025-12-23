# Enhanced Stats Generator System

## Overview

The Enhanced Stats Generator is a comprehensive stat management system that replaces the legacy 10-level stats with a new 9-level × 23-stat grid system. It includes multipliers, tags, timeline tracking, and advanced features for character stat generation.

## Key Features

### 1. 23 Stats Organized by Category

#### Core Stats (Red-Orange-Yellow hues)
- **HPMAX**: HP Maximum (health points)
- **QUICK**: Quickness (speed/turn order)
- **BBACK**: Bounce Back (recovery)

#### Attack Stats (Green hues)
- **ATMEL**: Attack Melee
- **ATRNG**: Attack Range
- **ATMAG**: Attack Magic
- **ATSPX**: Attack Special

#### Utility Stats (Cyan hues)
- **HEALR**: Healer (healing power)
- **ALLYX**: Ally Boost (buff strength)
- **ATSFX**: Status FX (status effect power)
- **THRET**: Threat (aggro generation)
- **SHILD**: Shield (damage mitigation)

#### Defence Stats (Blue-Purple hues)
- **DDMEL**: Defence Melee
- **DDRNG**: Defence Range
- **DDMAG**: Defence Magic
- **DDSPX**: Defence Special

#### Trait Stats (Magenta-Red hues)
- **EVADE**: Evasion
- **ACCUR**: Accuracy
- **COURG**: Courage
- **INTUI**: Intuition
- **AGGRO**: Aggression
- **ENRGY**: Energy
- **REGEN**: Regen (health regeneration)

### 2. Multiplier System

Each stat has 8 multipliers representing the growth from level to level:
- M1→2: Level 1 to Level 2 transition
- M2→3: Level 2 to Level 3 transition
- ... and so on through M8→9

Multipliers are stored with 3 decimal precision (e.g., "1.150" for 15% growth).

### 3. Manual Override System

You can manually set any stat value at any level. When you do:
- The cell is marked with a blue border to indicate manual override
- Auto-fill continues for subsequent levels using the multipliers
- You can clear manual overrides to return to calculated values

### 4. Lock System

Lock any stat to force it to zero across all levels:
- Click the 🔒/🔓 button for a stat
- Locked stats appear grayed out
- Useful for creating specialized characters (e.g., all melee, no magic)

### 5. Tag System (67+ Tags)

Tags modify stats based on character archetypes:

#### Role-Based Tags
- **glass_cannon**: High attack, low defense
- **tank**: High defense and HP
- **speedster**: High quickness and evasion
- **balanced**: Even distribution
- **melee_specialist**, **ranged_specialist**, **magic_specialist**
- **healer**, **support**, **damage_dealer**

#### Progression Tags
- **quick_starter**: Strong at level 1
- **late_bloomer**: Weak early, strong late
- **early_bloomer**: Strong early, weaker scaling
- **slow_starter**: Weak at level 1

#### Tag Conflicts
Some tags conflict with each other (e.g., glass_cannon vs tank). The system:
- Shows active tags (green badge)
- Shows ignored tags due to conflicts (yellow warning)
- Priority order matters - higher priority tags take precedence

### 6. Timeline Tracking

The timeline automatically tracks:
- **LEARN**: When each stat first becomes non-zero
- **BOOST**: When a stat has a significant jump (>150% growth)

Example: "Level 3: LEARN [ATMEL, DDMEL] BOOST [HPMAX]"

### 7. Cap Enforcement

Total stat points across all levels are capped at **5200**:
- Real-time calculation displayed at top
- Warning badge if cap is exceeded
- Validation prevents saving over-cap characters

### 8. Scaling Tools

#### Row Scaling
Scale all stats at a specific level by ±10%
- Buttons in each level column header
- Applies to all 23 stats simultaneously

#### Column Scaling
Scale a specific stat across all levels by ±10%
- Available in the column scaling section below the grid
- Applies to all 9 levels for that stat

### 9. Derived Values

The grid automatically calculates and displays:
- **ATK_SUM**: Sum of all attack stats
- **ATK_TOP**: Highest individual attack stat
- **DEF_SUM**: Sum of all defence stats
- **DEF_TOP**: Highest individual defence stat
- **LV_TOTAL**: Total of all stats at that level

### 10. Import/Export

#### Export
Click "📥 Export JSON" to download the stat sheet as a JSON file. This includes:
- All stat values (9 levels × 23 stats)
- Multipliers
- Manual overrides
- Locks
- Tag configuration
- Timeline data

#### Import
Click "📤 Import JSON" to load a previously exported stat sheet. The system validates:
- Version compatibility
- Data structure
- Stat boundaries
- Cap enforcement

## Usage Guide

### Getting Started

1. **Initialize Stat Sheet**: Click "🎯 Initialize Stat Sheet" to create a new stat sheet with default values
2. **Adjust Base Values**: Modify the "Lv1 Base" column to set starting values
3. **Tune Multipliers**: Adjust the M1→2, M2→3, etc. columns to control growth rates
4. **Apply Tags**: Select tags in the Tag System to automatically apply archetypes
5. **Manual Tweaks**: Click any cell to manually override specific values
6. **Review Timeline**: Check the timeline to see when stats unlock and boost
7. **Save**: Save the character to persist the stat sheet to Firebase

### Best Practices

1. **Start Simple**: Begin with default values and adjust incrementally
2. **Use Tags**: Let tags do the heavy lifting for common archetypes
3. **Check Total**: Always monitor the grand total to stay under cap (5200)
4. **Review Timeline**: Ensure stats unlock at appropriate levels
5. **Test Balance**: Use scaling tools to fine-tune overall power level
6. **Export Often**: Save different versions as JSON for A/B testing

### Visual Indicators

- **Color Coding**: Each stat has a unique hue (0-360) for easy identification
- **Blue Border**: Manual override
- **Gray Background**: Locked stat (forced to zero)
- **Diagonal Stripes**: Zero value
- **Cross-hatch Pattern**: Negative value (invalid)
- **Green Badge**: Active tag
- **Yellow Badge**: Ignored tag (conflict)

## Technical Details

### Data Structure

```typescript
interface StatSheet {
  version: 2;
  cap: 5200;
  
  stats: {
    [key: string]: number[]; // 9 levels per stat
  };
  
  multipliers: {
    [key: string]: string[]; // 8 multipliers per stat
  };
  
  manual?: {
    [key: string]: {
      [level: number]: string;
    };
  };
  
  locks?: {
    [key: string]: boolean;
  };
  
  boundaries?: {
    [key: string]: number; // Level 1 base values
  };
  
  tags: {
    selected: string[];
    ignored: string[];
    active: string[];
  };
  
  tracked?: {
    firstNonZero: { [key: string]: number };
    timeline: string[];
  };
}
```

### Migration

The system automatically migrates old `levelStats` (10 levels, 18 stats) to the new `statSheet` format when loading characters from Firebase. The migration:
- Maps old stat keys to new ones
- Interpolates missing stats
- Calculates multipliers from actual growth
- Preserves data integrity

### Validation Rules

1. **No Decreasing**: Stats cannot decrease from one level to the next
2. **Level 1 Limits**: Level 1 values must be within `lv1Low` to `lv1Limit`
3. **Absolute Limits**: No stat can exceed its `limit` value at any level
4. **Total Cap**: Grand total across all levels cannot exceed 5200
5. **Non-negative**: Stats cannot be negative

## Troubleshooting

### "Total exceeds cap" warning
- Reduce some stat values or multipliers
- Use row/column scaling to reduce overall power
- Remove some tags that boost stats

### "Validation errors" button appears
- Click to see specific errors
- Fix decreasing values
- Adjust out-of-bounds level 1 values
- Ensure stats don't exceed limits

### Tags not applying
- Check for conflicts (yellow warning badges)
- Reorder tags using ▲▼ buttons
- Remove conflicting lower-priority tags

### Timeline not updating
- Timeline updates automatically when stat values change
- Click the expand button to view full timeline
- LEARN events appear when stats first become non-zero
- BOOST events appear when growth exceeds 150%

## Future Enhancements

- Visual stat curve graphs
- Comparison tool (compare two characters)
- Template library (save/load common builds)
- Tag recommendation based on stats
- Undo/redo functionality
- Batch operations (scale multiple stats)
- Export to other formats (CSV, spreadsheet)
