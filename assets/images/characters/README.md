# Character Images

This directory contains image assets organized by character.

## Purpose
- Store character sprites and animations
- Organize character portraits and thumbnails
- Maintain battle animations
- Keep UI-related character graphics

## Structure
```
characters/
├── [character-name]/
│   ├── sprites/
│   ├── portraits/
│   ├── animations/
│   └── icons/
```

## File Naming Convention
Use the following pattern: `[character-name]-[state-action].[extension]`

Examples:
- `hero-idle.png` - Hero character in idle state
- `hero-attack.png` - Hero character performing attack
- `goblin-damaged.png` - Goblin character taking damage
- `mage-spell-cast.png` - Mage character casting a spell

Guidelines:
- Use lowercase with hyphens for character names
- Use descriptive state/action names
- Use consistent image formats (PNG for transparency, JPG for backgrounds)

## Supported Formats
- PNG (recommended for sprites with transparency)
- JPG (for backgrounds and non-transparent images)
- GIF (for simple animations)
