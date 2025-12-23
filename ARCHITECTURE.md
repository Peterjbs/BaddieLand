# Character Console - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Next.js)                         │
│                   apps/character-console/                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Home Page  │  │   Character  │  │   Layout     │          │
│  │              │  │    Editor    │  │  (Nav Bar)   │          │
│  └──────────────┘  └──────┬───────┘  └──────────────┘          │
│                            │                                      │
│         ┌──────────────────┴──────────────────┐                 │
│         │                                      │                 │
│  ┌──────▼──────┐                    ┌─────────▼────────┐        │
│  │  Character  │                    │   Asset Manager  │        │
│  │    Form     │                    │                  │        │
│  │  (6 Tabs)   │                    │  - Avatars       │        │
│  └──────┬──────┘                    │  - Sprite Sheets │        │
│         │                            │  - Tile Atlas    │        │
│  ┌──────▼──────────┐                └──────────────────┘        │
│  │  Move Editor    │                                             │
│  │    Modal        │                                             │
│  └─────────────────┘                                             │
│                                                                   │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    │ Firebase SDK
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│                      Firebase Services                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Firestore   │  │   Storage    │  │ Cloud        │          │
│  │              │  │              │  │ Functions    │          │
│  │ Collections: │  │ Buckets:     │  │              │          │
│  │ - characters │  │ - avatars    │  │ - generate   │          │
│  │ - moves      │  │ - sprites    │  │   Avatar     │          │
│  │ - admins     │  │ - atlases    │  │ - generate   │          │
│  │              │  │ - drafts     │  │   Sprite     │          │
│  │              │  │              │  │ - generate   │          │
│  │              │  │              │  │   Atlas      │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                               │                   │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                                                │ OpenAI API
                                                │
                                        ┌───────▼───────┐
                                        │   OpenAI      │
                                        │   DALL-E 3    │
                                        │               │
                                        │ Image         │
                                        │ Generation    │
                                        └───────────────┘
```

## Data Flow

### Character Creation Flow

```
User Action                    Application                  Firebase
───────────                    ───────────                  ────────

Click "Create" ──────────────▶ Generate new ID
                               Set defaults
                               
Fill form      ──────────────▶ Update local state
                               Validate inputs
                               
Click "Save"   ──────────────▶ Run validation  ──────────▶ saveCharacter()
                               Show loading                Write to Firestore
                               
               ◀──────────────  Success        ◀──────────  Document created
                               Show toast
                               Reload list
```

### Avatar Generation Flow

```
User Action                    Application                  Firebase                 OpenAI
───────────                    ───────────                  ────────                 ──────

Click "Generate ──────────────▶ Gather visual
Avatar"                         description
                                Call function   ──────────▶ generateAvatar()
                                                             Build prompt    ──────▶ DALL-E API
                                                             
                                                ◀──────────  Get image URL   ◀────── Image URL
                                                             
                                                             Download image
                                                             Upload to     ──────────▶ Storage
                                                             Storage       ◀────────── URL
                                                             
               ◀──────────────  Display draft   ◀──────────  Return URL
                                in drafts list
```

### Stats Generation Flow

```
User Action                    Application                  
───────────                    ───────────                  

Click "Generate ──────────────▶ Get growth curve
Stats"                          Apply curve formula
                                Calculate for levels 1-10
                                Update character state
                                Render table
                                
User edits     ──────────────▶  Update specific stat
stat                            Re-render row
```

## Component Tree

```
App
└── RootLayout
    ├── Navigation Bar
    │   ├── Home Link
    │   └── Character Editor Link
    │
    └── Page Content
        ├── Home Page
        │   └── Welcome Card
        │
        └── Character Editor Page
            ├── Left Sidebar
            │   ├── Character Dropdown
            │   ├── Create Button
            │   ├── Gang Filter
            │   ├── Template Selection
            │   └── Action Buttons
            │       ├── Save Button
            │       └── Delete Button
            │
            ├── Center Panel
            │   └── CharacterForm
            │       ├── Tab Navigation
            │       └── Tab Content
            │           ├── BasicInfoTab
            │           ├── VisualDescriptionTab
            │           ├── RolesGrowthTab
            │           ├── TagsConditionsTab
            │           ├── LevelStatsTab
            │           │   └── StatsTable
            │           └── MovesTab
            │               ├── Move List
            │               └── MoveEditorModal
            │                   ├── Move Form
            │                   ├── MaT Section
            │                   └── MaEC Section
            │
            └── Right Sidebar
                └── AssetManager
                    ├── Avatar Section
                    │   ├── Current Avatar Preview
                    │   ├── Generate Button
                    │   └── Drafts List (future)
                    │
                    ├── Sprite Sheet Section
                    │   ├── Current Sprite Preview
                    │   ├── Feedback Textarea
                    │   ├── Generate Button
                    │   └── Drafts List (future)
                    │
                    └── Tile Atlas Section
                        ├── Generate Button
                        └── Atlas Viewer (future)
```

## File Structure

```
BaddieLand/
│
├── apps/character-console/              # Next.js Application
│   ├── app/                             # Next.js 14 App Router
│   │   ├── character-editor/
│   │   │   └── page.tsx                 # Main editor page (9.8 KB)
│   │   ├── character-editor-styles.css  # Editor-specific styles (4.8 KB)
│   │   ├── globals.css                  # Global styles (4.3 KB)
│   │   ├── layout.tsx                   # Root layout with nav (675 B)
│   │   └── page.tsx                     # Home page (947 B)
│   │
│   ├── components/                      # React Components
│   │   ├── AssetManager.tsx            # Asset management UI (6.2 KB)
│   │   ├── CharacterForm.tsx           # Tabbed form (14.3 KB)
│   │   ├── MoveEditorModal.tsx         # Move editor (12 KB)
│   │   ├── StatsTable.tsx              # Stats editor (4.5 KB)
│   │   └── TileAtlasViewer.tsx         # Atlas preview (979 B)
│   │
│   ├── lib/                             # Utilities & Helpers
│   │   ├── atlas-generator.ts          # Atlas generation (4.3 KB)
│   │   ├── firebase-config.ts          # Firebase credentials (637 B)
│   │   ├── firebase.ts                 # Firebase init (692 B)
│   │   ├── firestore-helpers.ts        # Database operations (4.5 KB)
│   │   ├── reference-data.ts           # Data loading (1.6 KB)
│   │   └── validation.ts               # Validation utilities (2.9 KB)
│   │
│   ├── .env.example                     # Environment template
│   ├── .gitignore                       # Git ignore rules
│   ├── next.config.js                   # Next.js config
│   ├── package.json                     # Dependencies
│   ├── README.md                        # App documentation
│   └── tsconfig.json                    # TypeScript config
│
├── functions/sprites/                   # Firebase Cloud Functions
│   ├── src/
│   │   ├── atlas.ts                    # Atlas generation function (1.7 KB)
│   │   └── index.ts                    # Main exports (3.3 KB)
│   ├── package.json                     # Function dependencies
│   └── tsconfig.json                    # TypeScript config
│
├── data/pools/                          # Reference Data (existing)
│   ├── environmental-conditions.json    # MaEC conditions
│   ├── growth-curves.json              # Growth curves
│   ├── move-types.json                 # Move types
│   ├── roles.json                      # Character roles
│   ├── species.json                    # Species definitions
│   └── tags.json                       # MaT tags
│
├── firebase.json                        # Firebase project config
├── firestore.rules                      # Database security rules
├── firestore.indexes.json              # Database indexes
├── storage.rules                        # Storage security rules
│
├── SETUP_GUIDE.md                      # Setup instructions (6.5 KB)
├── TESTING_CHECKLIST.md                # Test cases (10.5 KB)
└── IMPLEMENTATION_GUIDE.md             # Implementation guide (14 KB)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.35 (React 18.2.0)
- **Language**: TypeScript 5.x
- **Styling**: CSS Modules with CSS Variables
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Platform**: Firebase
  - Firestore: NoSQL database
  - Storage: File storage
  - Cloud Functions: Serverless functions
  - Authentication: User management

### Build & Dev Tools
- **Package Manager**: npm
- **Bundler**: Next.js built-in (Webpack)
- **Linter**: ESLint
- **TypeScript**: Strict mode enabled

### Planned Integrations
- **OpenAI**: DALL-E 3 for image generation
- **Sharp**: Image processing (atlas generation)

## Security Model

### Firestore Rules
```javascript
// Characters & Moves: Public read, admin write
match /characters/{characterId} {
  allow read: if true;
  allow write: if isAdmin();
}

// Admins: Admin read only
match /admins/{email} {
  allow read: if isAdmin();
  allow write: if false;
}
```

### Storage Rules
```javascript
// Public assets: Public read, admin write
match /avatars/{characterId}/{fileName} {
  allow read: if true;
  allow write: if isAdmin();
}

// Drafts: Admin only
match /drafts/{allPaths=**} {
  allow read, write: if isAdmin();
}
```

### Function Auth
- Email verification required
- Admin check via Firestore lookup
- Throws HttpsError if unauthorized

## Performance Characteristics

### Bundle Sizes
- Home page: 87.4 KB
- Character editor: 209 KB (includes all components)
- Shared JS: 87.3 KB

### Build Time
- Clean build: ~10-15 seconds
- Incremental: ~2-5 seconds

### Runtime Performance
- Static page generation
- Client-side data fetching
- Optimistic UI updates
- Lazy loading for modals

## Scalability Considerations

### Current Limitations
- Client-side rendering (can be SSR'd)
- Single-user editing (can add real-time)
- Local state only (can add cache)

### Growth Path
1. Add Redis/Memcached for data caching
2. Implement Server-Side Rendering (SSR)
3. Add WebSocket for real-time collaboration
4. Implement CDN for static assets
5. Add background job processing
6. Scale Firebase (automatic with usage)

## Monitoring & Debugging

### Available Tools
- Browser DevTools console
- Firebase Console (Firestore, Storage, Functions logs)
- Next.js error overlay (development)
- Build-time type checking (TypeScript)

### Recommended Additions
- Sentry for error tracking
- Google Analytics for usage
- Firebase Performance Monitoring
- Custom logging service

## Deployment Options

### Option 1: Firebase Hosting
```bash
firebase deploy
```

### Option 2: Vercel (Recommended for Next.js)
```bash
vercel deploy
```

### Option 3: Self-hosted
```bash
npm run build
npm run start
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review Firebase usage/costs weekly
- Monitor error logs daily (when live)
- Backup Firestore weekly
- Review security rules quarterly

### Update Process
1. Update dependencies: `npm update`
2. Run tests: `npm run lint && npm run build`
3. Test locally
4. Deploy to staging
5. Test in staging
6. Deploy to production
