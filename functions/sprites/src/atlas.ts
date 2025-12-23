import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireEmail, assertIsAdmin } from './index';

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
