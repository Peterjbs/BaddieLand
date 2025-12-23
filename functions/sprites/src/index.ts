import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Helper to require email
export function requireEmail(email: string | undefined): string {
  if (!email) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  return email;
}

// Helper to check if user is admin
export async function assertIsAdmin(email: string): Promise<void> {
  const adminsRef = admin.firestore().collection('admins').doc(email);
  const doc = await adminsRef.get();
  
  if (!doc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'User is not an admin');
  }
  
  // Check if admin is active
  const data = doc.data();
  if (data && data.active === false) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access has been disabled');
  }
}

/**
 * Generate avatar for a character using OpenAI
 * This is a placeholder implementation
 */
export const generateAvatar = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, visualDescription } = data;

  if (!characterId) {
    throw new functions.https.HttpsError('invalid-argument', 'characterId is required');
  }

  // TODO: Implement OpenAI DALL-E API call
  // const imageUrl = await callOpenAI(visualDescription);

  // TODO: Upload to Firebase Storage
  // const storagePath = `drafts/avatars/${characterId}/${uuid}.png`;

  functions.logger.info(`Generate avatar requested for character: ${characterId}`);

  return {
    success: true,
    message: 'Avatar generation is not yet implemented',
    // avatarUrl: imageUrl,
    // storagePath: storagePath,
  };
});

/**
 * Generate sprite sheet for a character using OpenAI
 * This is a placeholder implementation
 */
export const generateDraftSpriteSheet = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, visualDescription, templateType, feedback } = data;

  if (!characterId || !templateType) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'characterId and templateType are required'
    );
  }

  // TODO: Implement OpenAI DALL-E API call
  // TODO: Generate sprite sheet based on template and visual description

  functions.logger.info(`Generate sprite sheet requested for character: ${characterId}`);

  return {
    success: true,
    message: 'Sprite sheet generation is not yet implemented',
    // spriteSheetUrl: imageUrl,
    // storagePath: storagePath,
  };
});

/**
 * Finalize a draft sprite sheet to permanent storage
 */
export const finalizeSpriteSheet = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, draftPath } = data;

  if (!characterId || !draftPath) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'characterId and draftPath are required'
    );
  }

  // TODO: Move from drafts to permanent storage
  // TODO: Update character document with new sprite sheet URL

  functions.logger.info(`Finalize sprite sheet for character: ${characterId}`);

  return {
    success: true,
    message: 'Sprite sheet finalization is not yet implemented',
  };
});

/**
 * Generate tile atlas from a sprite sheet
 */
export const generateTileAtlas = functions.https.onCall(async (data, context) => {
  const email = requireEmail(context.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, spriteSheetPath } = data;

  if (!characterId || !spriteSheetPath) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'characterId and spriteSheetPath are required'
    );
  }

  try {
    // Download sprite sheet from Storage
    const bucket = admin.storage().bucket();
    const spriteFile = bucket.file(spriteSheetPath);
    
    // TODO: Implement atlas generation logic
    // 1. Download sprite sheet
    // 2. Parse sprite sheet based on template
    // 3. Extract individual frames
    // 4. Pack frames into efficient atlas
    // 5. Generate metadata JSON

    // TODO: Upload atlas PNG and JSON to Storage
    const atlasPath = `atlases/${characterId}/${Date.now()}.png`;
    const metadataPath = `atlases/${characterId}/${Date.now()}.json`;

    // TODO: Update character document with atlas reference

    functions.logger.info(`Generate tile atlas for character: ${characterId}`);

    return {
      success: true,
      message: 'Tile atlas generation is not yet implemented',
      atlasPath,
      metadataPath,
      // atlasUrl,
      // metadataUrl,
    };
  } catch (error) {
    functions.logger.error('Error generating tile atlas:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate tile atlas');
  }
});
