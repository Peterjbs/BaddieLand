# Implementation Guide - Remaining Features

This guide outlines how to implement the placeholder features in the Character Console.

## 1. OpenAI Image Generation

### Avatar Generation

**Location**: `functions/sprites/src/index.ts` - `generateAvatar` function

**Steps**:

1. Install OpenAI SDK:
```bash
cd functions/sprites
npm install openai
```

2. Update the function:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAvatar = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, visualDescription } = data;

  // Build prompt from visual description
  const prompt = `
    Portrait of a fantasy RPG character:
    ${visualDescription.body_and_skin || ''}
    ${visualDescription.hair || ''}
    ${visualDescription.clothing || ''}
    ${visualDescription.distinguishing_features || ''}
    ${visualDescription.weapon_item ? `Holding: ${visualDescription.weapon_item}` : ''}
    
    Style: Fantasy RPG character portrait, detailed, high quality
  `.trim();

  // Generate image with DALL-E
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  const imageUrl = response.data[0].url;

  // Download image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  // Upload to Firebase Storage
  const bucket = admin.storage().bucket();
  const fileName = `${Date.now()}.png`;
  const filePath = `drafts/avatars/${characterId}/${fileName}`;
  const file = bucket.file(filePath);

  await file.save(Buffer.from(imageBuffer), {
    metadata: {
      contentType: 'image/png',
    },
  });

  // Get signed URL
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    success: true,
    avatarUrl: url,
    storagePath: filePath,
  };
});
```

### Sprite Sheet Generation

**Location**: `functions/sprites/src/index.ts` - `generateDraftSpriteSheet` function

**Implementation**:

Similar to avatar generation, but with different prompt:

```typescript
const prompt = `
  Character sprite sheet for a 2D RPG game.
  Template: ${templateType}
  16 frames per row, 8 rows total.
  ${visualDescription}
  
  Each frame shows the character in different poses:
  - Rows 1-2: Walking animation (8 directions)
  - Rows 3-4: Swimming animation (8 directions)
  - Rows 5-6: Attack animation (8 directions)
  - Rows 7-8: Idle animation (8 directions)
  
  Style: Pixel art or 2D sprite sheet, consistent size per frame
`;
```

**Challenge**: DALL-E may not generate perfect sprite sheets. Consider:
- Using DALL-E to generate reference images, then manually create sprite sheets
- Using a specialized sprite generation service
- Hiring artists to create sprites based on generated reference images

## 2. Tile Atlas Generation with Image Processing

### Install Image Processing Library

```bash
cd apps/character-console
npm install sharp
```

### Update atlas-generator.ts

**Location**: `apps/character-console/lib/atlas-generator.ts`

```typescript
import sharp from 'sharp';

export async function generateTileAtlas(
  spriteSheetUrl: string,
  characterId: string,
  templateType: string
): Promise<{ atlasImageBuffer: Buffer; metadata: AtlasMetadata }> {
  // Template configurations
  const templates: Record<string, { rows: number; cols: number; frameWidth: number; frameHeight: number }> = {
    walker_swim: { rows: 8, cols: 16, frameWidth: 64, frameHeight: 64 },
    walker_swim_fly: { rows: 10, cols: 16, frameWidth: 64, frameHeight: 64 },
    hover_flying: { rows: 6, cols: 16, frameWidth: 64, frameHeight: 64 },
    constant_motion_fx: { rows: 4, cols: 16, frameWidth: 64, frameHeight: 64 },
  };

  const template = templates[templateType] || templates.walker_swim;

  // Download sprite sheet
  const response = await fetch(spriteSheetUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Load with Sharp
  const spriteSheet = sharp(buffer);
  const metadata = await spriteSheet.metadata();

  // Extract frames
  const frames: { buffer: Buffer; name: string; x: number; y: number }[] = [];
  
  for (let row = 0; row < template.rows; row++) {
    for (let col = 0; col < template.cols; col++) {
      const frameBuffer = await spriteSheet
        .extract({
          left: col * template.frameWidth,
          top: row * template.frameHeight,
          width: template.frameWidth,
          height: template.frameHeight,
        })
        .toBuffer();

      frames.push({
        buffer: frameBuffer,
        name: `${characterId}_frame_${(row * template.cols + col).toString().padStart(3, '0')}.png`,
        x: col * template.frameWidth,
        y: row * template.frameHeight,
      });
    }
  }

  // Pack frames (for now, just use the original layout)
  // TODO: Implement proper bin-packing for space efficiency
  const atlasWidth = template.cols * template.frameWidth;
  const atlasHeight = template.rows * template.frameHeight;

  // Create atlas metadata
  const atlasMetadata: AtlasMetadata = {
    frames: {},
    meta: {
      app: 'BaddieLand Character Console',
      version: '1.0',
      image: `${characterId}_atlas.png`,
      format: 'RGBA8888',
      size: { w: atlasWidth, h: atlasHeight },
      scale: '1',
    },
  };

  frames.forEach((frame) => {
    atlasMetadata.frames[frame.name] = {
      filename: frame.name,
      frame: { x: frame.x, y: frame.y, w: template.frameWidth, h: template.frameHeight },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: template.frameWidth, h: template.frameHeight },
      sourceSize: { w: template.frameWidth, h: template.frameHeight },
    };
  });

  // For now, return the original sprite sheet as atlas
  const atlasImageBuffer = buffer;

  return {
    atlasImageBuffer,
    metadata: atlasMetadata,
  };
}
```

### Update Firebase Function

**Location**: `functions/sprites/src/atlas.ts`

```typescript
import * as admin from 'firebase-admin';
import { generateTileAtlas as generateAtlasUtil } from '../../apps/character-console/lib/atlas-generator';

export const generateTileAtlas = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, spriteSheetPath } = data;

  // Get sprite sheet URL
  const bucket = admin.storage().bucket();
  const spriteFile = bucket.file(spriteSheetPath);
  const [url] = await spriteFile.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  // Generate atlas
  const { atlasImageBuffer, metadata } = await generateAtlasUtil(
    url,
    characterId,
    'walker_swim' // Get from data
  );

  // Upload atlas PNG
  const atlasPath = `atlases/${characterId}/${Date.now()}.png`;
  const atlasFile = bucket.file(atlasPath);
  await atlasFile.save(atlasImageBuffer, {
    metadata: { contentType: 'image/png' },
  });

  // Upload metadata JSON
  const metadataPath = `atlases/${characterId}/${Date.now()}.json`;
  const metadataFile = bucket.file(metadataPath);
  await metadataFile.save(JSON.stringify(metadata, null, 2), {
    metadata: { contentType: 'application/json' },
  });

  // Get URLs
  const [atlasUrl] = await atlasFile.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const [metadataUrl] = await metadataFile.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return {
    success: true,
    atlasPath,
    metadataPath,
    atlasUrl,
    metadataUrl,
  };
});
```

## 3. Draft Management UI

### Create DraftsList Component

**Location**: `apps/character-console/components/DraftsList.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface Draft {
  name: string;
  url: string;
  path: string;
  createdAt: Date;
}

export default function DraftsList({ 
  characterId, 
  type 
}: { 
  characterId: string; 
  type: 'avatars' | 'spritesheets' 
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, [characterId, type]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const draftsRef = ref(storage, `drafts/${type}/${characterId}`);
      const result = await listAll(draftsRef);
      
      const draftsList = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await item.getMetadata();
          return {
            name: item.name,
            url,
            path: item.fullPath,
            createdAt: new Date(metadata.timeCreated),
          };
        })
      );

      draftsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setDrafts(draftsList);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading drafts...</div>;
  if (drafts.length === 0) return <div>No drafts yet</div>;

  return (
    <div className="draft-list">
      {drafts.map((draft) => (
        <div key={draft.path} className="draft-item">
          <img src={draft.url} alt={draft.name} />
          <div className="draft-actions">
            <button className="button button-small">Set Active</button>
            <button className="button button-small button-danger">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Update AssetManager

Add the DraftsList component to AssetManager for both avatars and sprite sheets.

## 4. Firebase Authentication Setup

### In Firebase Console

1. Enable Email/Password authentication
2. Create admin users
3. Add emails to `admins` collection in Firestore

### Add Auth to Application

**Location**: `apps/character-console/app/layout.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <LoginPage />;
  }

  return (
    <html lang="en">
      <body>
        <nav className="nav-bar">
          <h1>BaddieLand Character Console</h1>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/character-editor">Character Editor</a>
            <button onClick={() => signOut(auth)}>Logout</button>
          </div>
        </nav>
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
```

## 5. Improved Bin-Packing Algorithm

For more efficient atlas generation, implement a better bin-packing algorithm:

```typescript
class MaxRectsBinPack {
  private width: number;
  private height: number;
  private usedRectangles: Rect[] = [];
  private freeRectangles: Rect[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.freeRectangles.push({ x: 0, y: 0, w: width, h: height });
  }

  insert(width: number, height: number): Rect | null {
    let bestNode: Rect | null = null;
    let bestShortSideFit = Number.MAX_VALUE;

    for (const freeRect of this.freeRectangles) {
      if (freeRect.w >= width && freeRect.h >= height) {
        const leftoverHoriz = Math.abs(freeRect.w - width);
        const leftoverVert = Math.abs(freeRect.h - height);
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert);

        if (shortSideFit < bestShortSideFit) {
          bestNode = { x: freeRect.x, y: freeRect.y, w: width, h: height };
          bestShortSideFit = shortSideFit;
        }
      }
    }

    if (bestNode) {
      this.placeRectangle(bestNode);
    }

    return bestNode;
  }

  private placeRectangle(node: Rect) {
    const numRectanglesToProcess = this.freeRectangles.length;
    for (let i = 0; i < numRectanglesToProcess; i++) {
      if (this.splitFreeNode(this.freeRectangles[i], node)) {
        this.freeRectangles.splice(i, 1);
        i--;
      }
    }

    this.pruneFreeList();
    this.usedRectangles.push(node);
  }

  private splitFreeNode(freeNode: Rect, usedNode: Rect): boolean {
    // Implement splitting logic
    // ...
    return false;
  }

  private pruneFreeList() {
    // Remove redundant free rectangles
    // ...
  }
}
```

## 6. Real-time Updates

For collaborative editing, add Firestore listeners:

```typescript
import { onSnapshot, doc } from 'firebase/firestore';

useEffect(() => {
  if (!selectedCharacter) return;

  const unsubscribe = onSnapshot(
    doc(db, 'characters', selectedCharacter.id),
    (doc) => {
      if (doc.exists()) {
        setSelectedCharacter({ id: doc.id, ...doc.data() } as Character);
      }
    }
  );

  return () => unsubscribe();
}, [selectedCharacter?.id]);
```

## Testing Each Feature

After implementing each feature:

1. Test in development environment
2. Test error cases
3. Test with real data
4. Monitor Firebase usage and costs
5. Optimize if needed

## Deployment Checklist

- [ ] Set environment variables in production
- [ ] Deploy Firestore rules
- [ ] Deploy Storage rules
- [ ] Deploy Cloud Functions
- [ ] Test in production environment
- [ ] Monitor logs and errors
- [ ] Set up error tracking (Sentry, etc.)
