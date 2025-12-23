# BaddieLand Character Console

A comprehensive admin console for managing characters, generating sprites, and creating assets for the BaddieLand RPG game.

## Features

- **Character Editor**: Create and edit character data including stats, moves, visual descriptions
- **Avatar Generation**: Generate character avatars using AI
- **Sprite Sheet Generation**: Create animated sprite sheets with customizable templates
- **Tile Atlas Generator**: Convert sprite sheets into efficient tile atlases
- **Asset Management**: Manage drafts and finalize character assets

## Setup

### Prerequisites

- Node.js 18 or later
- Firebase account
- OpenAI API key (for image generation)

### Installation

1. Clone the repository:
```bash
cd apps/character-console
npm install
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore, Storage, and Functions
   - Copy `.env.example` to `.env.local` and fill in your Firebase credentials
   - Update `lib/firebase-config.ts` with your project details

3. Set up Firebase Functions:
```bash
cd ../../functions/sprites
npm install
```

4. Deploy Firebase Functions (optional, for production):
```bash
npm run deploy
```

### Development

Start the Next.js development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure

```
apps/character-console/
├── app/
│   ├── character-editor/    # Character editor page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── CharacterForm.tsx     # Tabbed character form
│   ├── StatsTable.tsx        # Level stats editor
│   ├── MoveEditorModal.tsx   # Move creation/editing
│   ├── AssetManager.tsx      # Avatar/sprite management
│   └── TileAtlasViewer.tsx   # Atlas preview
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   ├── firebase-config.ts    # Firebase configuration
│   ├── firestore-helpers.ts  # Database operations
│   ├── validation.ts         # Data validation
│   └── atlas-generator.ts    # Tile atlas generation
└── package.json
```

## Reference Data

The application uses reference data from `/data/pools/`:
- `roles.json` - Character role options
- `tags.json` - MaT (Multiplier Affecting Tags)
- `species.json` - Species and subspecies
- `growth-curves.json` - Stat progression curves
- `move-types.json` - Move type categories
- `environmental-conditions.json` - MaEC conditions

## Usage

### Creating a Character

1. Click "Create New Character" in the left sidebar
2. Fill in basic information (name, species, gang, etc.)
3. Add visual descriptions for AI generation
4. Configure roles and growth curve
5. Select appropriate MaT tags
6. Edit level stats (or generate automatically)
7. Add moves with the move editor
8. Save the character

### Generating Assets

1. Select a character
2. In the right panel, use the asset management tools:
   - **Generate Avatar**: Creates a portrait image
   - **Generate Sprite Sheet**: Creates animated sprite frames
   - **Generate Tile Atlas**: Converts sprite sheet to game-ready atlas

### Managing Moves

1. Navigate to the "Moves" tab
2. Click "Add Move" to create a new move
3. Configure move properties:
   - Type (melee, ranged, magic, etc.)
   - Target (enemy, ally, self, etc.)
   - MaT multipliers for tag-based effects
   - MaEC multipliers for environmental effects
4. Save the move

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save character
- `Esc` - Close modals

## Firebase Functions

The following Firebase Functions are available:

### `generateAvatar`
Generates a character avatar using OpenAI DALL-E.

### `generateDraftSpriteSheet`
Generates a sprite sheet based on character visual description and template type.

### `finalizeSpriteSheet`
Moves a draft sprite sheet to permanent storage.

### `generateTileAtlas`
Converts a sprite sheet into a tile atlas with metadata.

## TODO

- [ ] Implement actual OpenAI API integration
- [ ] Complete image processing for tile atlas generation
- [ ] Add batch operations for multiple characters
- [ ] Implement character export/import (JSON)
- [ ] Add undo/redo functionality
- [ ] Implement real-time collaboration
- [ ] Add character preview/visualization
- [ ] Implement search and filtering
- [ ] Add analytics and usage tracking

## Contributing

See the main repository README for contribution guidelines.

## License

See the main repository for license information.
