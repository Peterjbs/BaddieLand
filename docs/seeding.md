# Firebase Firestore Seeding Guide

This guide explains how to seed the Firebase Firestore database with the RPG style and vibe guide data for BaddieLand.

## Prerequisites

1. **Firebase Project**: You need an active Firebase project
2. **Node.js**: Version 14 or higher
3. **Firebase CLI**: Install globally with `npm install -g firebase-tools`
4. **Firebase Admin SDK**: Required for programmatic seeding (installed via `npm install`)

## Setup

### 1. Firebase Configuration

Create a `.env` file in the project root with your Firebase configuration:

```bash
# Firebase Project Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

**⚠️ IMPORTANT**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `firebase-admin`: For Node.js server-side Firebase operations
- `dotenv`: For environment variable management

## Seeding Methods

### Method 1: Using the Seed Script (Recommended)

The easiest way to seed the style/vibe guides data:

```bash
npm run seed:style-vibes
```

This command:
1. Reads the data from `data/styleVibeGuides.json`
2. Connects to your Firebase project
3. Creates/updates the `styleVibeGuides` collection
4. Imports all 72 area documents

**Dry Run** (validate without writing):
```bash
npm run seed:style-vibes:dry
```

### Method 2: Using Firebase CLI

If you prefer using the Firebase CLI directly:

```bash
# Login to Firebase (first time only)
firebase login

# Set your project
firebase use your-project-id

# Note: Firebase CLI's firestore:import requires a specific export format
# Use Method 1 or Method 3 for initial seeding
```

### Method 3: Manual Import via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. Click "Import/Export" in the top menu
5. Choose "Import" and select the `data/styleVibeGuides.json` file
6. Note: You may need to convert the JSON format to match Firebase's import format

## Data Structure

### Collection: `styleVibeGuides`

Each document in the collection represents one area/location in the game world.

**Document Schema**:
```typescript
{
  id: string;              // Document ID (kebab-case)
  name: string;            // Display name
  visualDescription: string; // Detailed visual description
  keyPalette: string[];    // Array of hex color codes
  activities: string[];    // Array of activity strings
}
```

**Example Document**:
```json
{
  "id": "green-grotto",
  "name": "The Green Grotto",
  "visualDescription": "Overgrown cave mouths and mossy limestone arches...",
  "keyPalette": ["#2E7D32", "#6D4C41", "#C8A24A", "#2F3E2E"],
  "activities": ["campfires", "wagon-tending", "bare-knuckle-sparring"]
}
```

### Total Documents: 72

The seed file contains 72 unique area documents covering:
- Major locations (Green Grotto, Misty Mountains, Bubble Brook, etc.)
- Landmarks (Whisper Kiosk, Receipt Tree, Blue Beanstalk, etc.)
- Routes and paths (Radgey Road, Robbers Road, Willowwisp Way, etc.)
- Special zones (Fairyglade, Whispering Woods, Direwood, etc.)

## Verification

After seeding, verify the data:

### Using Firebase Console
1. Open your Firebase Console
2. Go to Firestore Database
3. Check the `styleVibeGuides` collection
4. Verify you have 72 documents
5. Spot-check a few documents for correct structure

### Using the Verify Script
```bash
npm run verify:style-vibes
```

This will:
- Count documents in the collection
- Validate document structure
- Report any missing or malformed documents

## Updating Data

To update existing data:

1. Edit `data/styleVibeGuides.json`
2. Run the seed script again:
   ```bash
   npm run seed:style-vibes
   ```

The script will update existing documents by ID and add any new ones.

## Troubleshooting

### Authentication Errors

**Error**: "Could not load the default credentials"

**Solution**: 
1. Ensure your `.env` file has correct Firebase credentials
2. Check that `FIREBASE_PRIVATE_KEY` is properly formatted (with newlines preserved)
3. Verify your service account has Firestore write permissions

### Permission Errors

**Error**: "Missing or insufficient permissions"

**Solution**:
1. Check Firestore security rules
2. Ensure your service account has the "Cloud Datastore User" role
3. For development, you can temporarily use permissive rules (⚠️ not for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /styleVibeGuides/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

### Data Format Errors

**Error**: "Invalid document data"

**Solution**:
1. Validate JSON syntax in `data/styleVibeGuides.json`
2. Ensure all hex codes are valid (start with `#`)
3. Check that arrays don't have trailing commas
4. Run: `npm run validate:json`

## Getting Service Account Credentials

To obtain Firebase service account credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon → Project Settings
4. Navigate to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download the JSON file
7. Extract the values for your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## Security Best Practices

1. **Never commit credentials**: The `.env` file should never be committed
2. **Use environment-specific configs**: Maintain separate credentials for dev/staging/production
3. **Restrict service account permissions**: Grant only necessary Firestore permissions
4. **Rotate keys regularly**: Generate new service account keys periodically
5. **Use Secret Management**: For production, use Firebase App Hosting secrets or Cloud Secret Manager

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Data Model Documentation](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## Support

For issues specific to BaddieLand seeding:
- Check existing GitHub issues
- Create a new issue with the `firebase` and `seeding` labels
- Include error messages and your Node.js version
