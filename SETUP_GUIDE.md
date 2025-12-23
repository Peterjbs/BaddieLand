# Character Console - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install Next.js app dependencies
cd apps/character-console
npm install

# Install Firebase Functions dependencies
cd ../../functions/sprites
npm install
```

### 2. Configure Firebase

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the following services:
   - **Firestore Database** (Native mode)
   - **Storage**
   - **Cloud Functions**
   - **Authentication** (Email/Password)

#### Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Under "Your apps", add a Web app
3. Copy the Firebase configuration object

#### Configure Environment Variables

1. Copy the example env file:
```bash
cd apps/character-console
cp .env.example .env.local
```

2. Fill in your Firebase credentials in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. (Optional) Add OpenAI API key for image generation:
```env
OPENAI_API_KEY=sk-...
```

#### Deploy Firebase Configuration

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the repository root:
```bash
cd /path/to/BaddieLand
firebase init
```
   - Select: Firestore, Functions, Storage
   - Use existing project
   - Accept default file paths

4. Deploy Firestore rules and indexes:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

5. Deploy Storage rules:
```bash
firebase deploy --only storage
```

6. Deploy Cloud Functions:
```bash
firebase deploy --only functions
```

### 3. Set Up Admin Users

1. Go to Firebase Console → Authentication
2. Add a user with email/password
3. Go to Firestore Database
4. Create a collection called `admins`
5. Add a document with the admin's email as the document ID:
```
admins/
  └── admin@example.com
      └── { active: true }
```

### 4. Run Development Server

```bash
cd apps/character-console
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
BaddieLand/
├── apps/character-console/          # Next.js application
│   ├── app/
│   │   ├── character-editor/        # Character editor page
│   │   ├── layout.tsx               # Root layout with navigation
│   │   ├── globals.css              # Global styles
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── CharacterForm.tsx        # Main form with tabs
│   │   ├── StatsTable.tsx           # Level stats editor
│   │   ├── MoveEditorModal.tsx      # Move editor modal
│   │   ├── AssetManager.tsx         # Asset management panel
│   │   └── TileAtlasViewer.tsx      # Atlas preview
│   ├── lib/
│   │   ├── firebase.ts              # Firebase initialization
│   │   ├── firebase-config.ts       # Firebase credentials
│   │   ├── firestore-helpers.ts     # Database operations
│   │   ├── reference-data.ts        # Load reference data
│   │   ├── validation.ts            # Data validation
│   │   └── atlas-generator.ts       # Atlas generation utility
│   └── package.json
│
├── functions/sprites/               # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts                 # Main functions export
│   │   └── atlas.ts                 # Atlas generation function
│   └── package.json
│
├── data/pools/                      # Reference data (already exists)
│   ├── roles.json
│   ├── tags.json
│   ├── species.json
│   ├── growth-curves.json
│   ├── move-types.json
│   └── environmental-conditions.json
│
└── firebase.json                    # Firebase configuration
```

## Development Workflow

### Running the App Locally

```bash
cd apps/character-console
npm run dev
```

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Testing Firebase Functions Locally

```bash
cd functions/sprites
npm run serve
```

This starts the Firebase emulator suite. You can test functions at:
http://localhost:5001/YOUR_PROJECT_ID/us-central1/FUNCTION_NAME

## Troubleshooting

### "Firebase not initialized" error

**Cause**: Environment variables not set or Firebase credentials incorrect

**Solution**: 
1. Verify `.env.local` exists and has correct values
2. Restart the development server after changing env vars
3. Check Firebase Console that Web app is configured

### "Permission denied" error in Firestore

**Cause**: User is not listed in `admins` collection

**Solution**:
1. Go to Firestore Database in Firebase Console
2. Ensure `admins` collection exists
3. Add document with user's email as ID

### Build fails with "Cannot find module" errors

**Cause**: Dependencies not installed or node_modules corrupted

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors about JSON imports

**Cause**: TypeScript not configured to resolve JSON modules

**Solution**: Already configured in `tsconfig.json` with:
- `"resolveJsonModule": true`
- `"include": [..., "../../data/pools/*.json"]`

### Functions deployment fails

**Cause**: Functions not built before deployment

**Solution**:
```bash
cd functions/sprites
npm run build
firebase deploy --only functions
```

## Next Steps

After setup, you can:

1. **Import Existing Characters**: Write a script to import from `/data/characters/` into Firestore
2. **Implement OpenAI Integration**: Add DALL-E API calls in Firebase Functions
3. **Add Image Processing**: Install Sharp library for atlas generation
4. **Test Character Creation**: Create a test character through the UI
5. **Deploy to Production**: Use Firebase Hosting or Vercel

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review Firebase Console logs
3. Check browser console for client-side errors
4. Review Firebase Functions logs: `firebase functions:log`
