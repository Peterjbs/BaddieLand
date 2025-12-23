import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export atlas generation function
export * from './atlas';

// Helper to require email
export function requireEmail(email: string | undefined): string {
  if (!email) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  return email;
}

// Helper to check if user is admin
export async function assertIsAdmin(email: string): Promise<void> {
  // TODO: Implement actual admin check
  // For now, this is a placeholder
  const adminsRef = admin.firestore().collection('admins').doc(email);
  const doc = await adminsRef.get();
  
  if (!doc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'User is not an admin');
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
