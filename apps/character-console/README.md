# BaddieLand Character Console

A comprehensive admin console for managing characters, generating sprites, and creating assets for the BaddieLand RPG game.

## Features

- **Character Editor**: Create and edit character data including stats, moves, visual descriptions
- **Avatar Generation**: Generate character avatars using AI
- **Sprite Sheet Generation**: Create animated sprite sheets with customizable templates
- **Tile Atlas Generator**: Convert sprite sheets into efficient tile atlases
- **Asset Management**: Manage drafts and finalize character assets
A comprehensive character creation and editing interface for BaddieLand RPG, built with Next.js 14, TypeScript, and Firebase.

## Features

### Character Management
- **Character List Sidebar**: View all characters with gang-based filtering
- **Create/Edit/Delete**: Full CRUD operations for character management
- **Auto-save**: Automatic saving on field blur with status notifications
- **Gang Color Coding**: Visual indicators for GGG (green), MMM (red), BBB (blue), PPP (purple)

### Character Editor Sections

#### 1. Identity Form
- Basic information: ID, name, age, gang, species, subspecies
- Role selection: Primary, secondary, and tertiary roles
- Growth curve selection
- Weapon item
- MaT (Multiplier Affecting Tags) selection with category grouping (max 10)

#### 2. Visual Description Form
Collapsible form with detailed visual fields:
- Body and skin description
- Hair description
- Clothing description
- Distinguishing features
- Weapon item visuals

#### 3. Avatar Manager
- Display active avatar
- Grid of unapproved avatars with approve/reject actions
- Collapsible rejected avatars section
- Generate new avatar button (requires Firebase Cloud Functions)

#### 4. Sprite Sheet Manager
- Latest sprite sheet preview with metadata
- Template type selector (walker_swim, walker_swim_fly, hover_flying, constant_motion_fx)
- Feedback textarea for iterative refinement
- Generate draft button with loading state
- Collapsible prompt preview
- Save to storage button (requires Firebase Cloud Functions)

#### 5. Level Stats Table
- Editable grid for all 10 levels
- 18 stat columns: HP, BBS, SPD, EVA, ACC, MLA, RGA, MAA, SPA, MLD, RGD, MAD, SPD_DEF, INT, AGG, CRG, XPA, XPT
- Auto-calculate helper button based on growth curve

#### 6. Moves Editor
- Expandable cards for each move (max 10)
- Edit modal with comprehensive fields:
  - Move ID, name, description
  - Type selection from move types pool
  - Target configuration (type and count)
  - Learned at level (1-10)
  - Effect algorithm (formula)
  - MaT multipliers (optional)
  - MaEC conditions (optional)
- Add/Edit/Delete operations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Database**: Firebase Firestore
- **Functions**: Firebase Cloud Functions (for avatar and sprite generation)
- **Validation**: Zod schemas
- **Form Management**: React state with auto-save

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
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Firebase Cloud Functions deployed (optional, for avatar/sprite generation)

### Installation

1. Navigate to the character console directory:
```bash
cd apps/character-console
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Firebase configuration:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

Start the Next.js development server:
Run the development server:
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
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Data Structure

### Character Schema

```typescript
{
  id: string;                    // Unique UUID
  name: string;                  // Character name
  age?: number;                  // Optional age
  gang: 'GGG' | 'MMM' | 'BBB' | 'PPP';
  species: string;               // From species pool
  subspecies?: string;
  specific_visuals?: string;
  roles: {
    primary: string;             // Required, from roles pool
    secondary?: string;
    tertiary?: string;
  };
  growthCurve: string;           // From growth curves pool
  weaponItem?: string;
  matTags?: string[];            // Max 10, from tags pool
  overview?: string;
  visual_description?: {
    body_and_skin?: string;
    hair?: string;
    clothing?: string;
    distinguishing_features?: string;
    weapon_item?: string;
  };
  vibe?: string;
  level_stats?: LevelStats[];    // Array of 10 levels
  moves?: Move[];                // Max 10 moves
  activeAvatar?: string;
  unapprovedAvatars?: string[];
  rejectedAvatars?: string[];
  latestSpriteSheet?: {
    path: string;
    templateType: string;
    metadata: any;
  };
}
```

### Data Pools

Located in `/public/data/`:
- `roles.json` - 12 character roles
- `tags.json` - MaT tags grouped by category
- `species.json` - Species groups with visual descriptions
- `growth-curves.json` - 6 growth curve types
- `move-types.json` - 9 move categories
- `environmental-conditions.json` - MaEC conditions

## Firebase Structure

### Firestore Collections

```
/characters/{characterId}
  - All character data as defined in schema
```

### Cloud Functions (Optional)

If deploying Firebase Cloud Functions for avatar/sprite generation:

```javascript
// functions/index.ts
generateAvatar({ characterId, edits })
setActiveAvatar({ characterId, draftPath })
generateDraftSpriteSheet({ characterId, templateType, edits, feedback })
finalizeSpriteSheet({ characterId, draftPath, templateType })
```

## Validation

Form validation using Zod schemas:
- Required fields: `id`, `name`, `species`, `roles.primary`, `growthCurve`
- Age: Positive integer
- MaT tags: Maximum 10
- Moves: Maximum 10, unique names, `learned_at_level` 1-10
- Level stats: Values 1-100 (except XPA/XPT which have no max)

## Gang Color Palette

```css
GGG: #10b981 (green)
MMM: #ef4444 (red)
BBB: #3b82f6 (blue)
PPP: #a855f7 (purple)
```

## Known Limitations

1. **Firebase Functions**: Avatar and sprite sheet generation require Firebase Cloud Functions to be deployed. Placeholder alerts are shown if functions are not available.

2. **Network Requirements**: Google Fonts are disabled due to network restrictions in the build environment.

3. **Form Validation**: While Zod schemas are defined, client-side validation with error messages is not fully implemented.

4. **Offline Support**: The application requires an active internet connection to interact with Firestore.

## Future Enhancements

- [ ] Toast notification system for better user feedback
- [ ] Comprehensive client-side form validation with error messages
- [ ] Undo/redo functionality
- [ ] Character duplication
- [ ] Bulk import/export of characters
- [ ] Search and advanced filtering
- [ ] Character comparison view
- [ ] Integration with game engine for live testing

## License

Part of the BaddieLand RPG project.
