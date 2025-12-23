# Character Console Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd apps/character-console
   npm install
   ```

2. **Configure Firebase**
   
   Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   
   Update with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000

## Production Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Deployment Platforms

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard

### Other Platforms
- **Netlify**: Configure build command `npm run build` and publish directory `.next`
- **Self-hosted**: Use `npm start` after building
- **Docker**: Create Dockerfile with Node.js base image

## Firebase Setup

### Required Services
1. **Firestore Database**
   - Create collection: `characters`
   - Set up security rules

2. **Firebase Storage** (Optional)
   - For avatar and sprite sheet storage

3. **Cloud Functions** (Optional)
   - Deploy functions for avatar/sprite generation
   - Functions directory: `functions/`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /characters/{characterId} {
      allow read: if true;
      allow write: if true; // TODO: Add authentication
    }
  }
}
```

## Environment Variables

Required:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires 18+)
- Clear cache: `rm -rf .next node_modules package-lock.json && npm install`

### Firebase Connection Issues
- Verify environment variables are set
- Check Firebase project configuration
- Ensure Firestore is enabled in Firebase console

### Cannot Connect to Firestore
- Check if running in browser (not SSR)
- Verify Firebase initialization in `lib/firebase.ts`
- Check browser console for errors

## Development Tips

1. **Hot Reload**: Changes auto-refresh in development mode
2. **TypeScript**: Type checking runs during build
3. **Linting**: Run `npm run lint` to check code quality
4. **Data Backup**: Export Firestore data regularly

## Performance

- First Load JS: ~189 kB
- Build time: ~10-30 seconds
- Optimized for production with Next.js built-in optimizations

## Support

For issues or questions:
1. Check the README.md for documentation
2. Review Firestore console for data issues
3. Check browser console for client-side errors
4. Verify Firebase configuration
