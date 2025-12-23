# BaddieLand

A battle-based RPG game with Firebase Firestore backend.

## Project Structure

```
BaddieLand/
├── .github/workflows/      # CI/CD workflows
├── assets/images/          # Image assets organized by type
│   └── characters/        # Character sprites, portraits, and animations
├── data/                   # Game data files
│   ├── characters/        # Character data
│   ├── styleVibeGuides.json # RPG area style and vibe guides
│   └── ...                # Other game data
├── docs/                   # Documentation
│   ├── reference/         # Reference documentation for agents
│   └── seeding.md         # Firebase seeding instructions
├── logs/progress/          # Development progress logs
├── scripts/                # Utility scripts (seeding, validation)
├── specs/                  # Game specifications and design documents
└── tasks/                  # Task instructions and guidelines
```

## Directory Purposes

- **`.github/workflows/`** - Contains GitHub Actions workflows for automated testing, builds, and deployments
- **`assets/images/characters/`** - Stores character image assets with subdirectories for each character
- **`data/`** - Game data including characters, moves, style/vibe guides, and more
- **`docs/reference/`** - Reference documentation used by agents during the build process
- **`docs/seeding.md`** - Instructions for seeding Firebase Firestore with game data
- **`logs/progress/`** - Development progress logs and milestone tracking
- **`scripts/`** - Utility scripts for data validation and Firebase seeding
- **`specs/`** - Game specifications, design documents, and technical requirements
- **`tasks/`** - Task instructions and development guidelines

## Firebase Setup

This project uses Firebase Firestore for data storage. To set up and seed the database:

1. **Install dependencies**: `npm install`
2. **Configure Firebase**: Copy `.env.example` to `.env` and add your Firebase credentials
3. **Seed the database**: `npm run seed:style-vibes`

For detailed Firebase setup and seeding instructions, see [docs/seeding.md](docs/seeding.md).

## Available Scripts

- `npm run seed:style-vibes` - Seed Firebase with style and vibe guide data
- `npm run seed:style-vibes:dry` - Validate data without writing to Firebase
- `npm run verify:style-vibes` - Verify seeded data in Firebase
- `npm run validate:json` - Validate JSON data files locally

See the README.md file in each directory for more detailed information about its purpose and usage.
