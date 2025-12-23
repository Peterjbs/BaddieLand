import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PNG } from 'pngjs';

// Initialize Firebase Admin
admin.initializeApp();

type Rgba = { r: number; g: number; b: number; a?: number };
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;
const ATLAS_SIZE = 1000;
const RIVER_WOBBLE_FREQUENCY = 30;
const RIVER_CURVE_FACTOR = 0.2;
const VERTICAL_PIXELS_PER_METER = 32;
const DRAFT_STATUS = 'draft';
const HUB_AREA = {
  id: '06.05',
  name: 'The Hub',
  baseTerrain: 'Fairyglade border with Rainbow Riverbank',
  locations: ['Cobble Cross', 'The Whisper Kiosk'],
};
const SUPPORTED_AREAS = [HUB_AREA.id];

// Simple deterministic PRNG (mulberry32)
function createPrng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function setPixel(png: PNG, x: number, y: number, color: Rgba) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = color.r;
  png.data[idx + 1] = color.g;
  png.data[idx + 2] = color.b;
  png.data[idx + 3] = color.a ?? 255;
}

function drawLine(png: PNG, x0: number, y0: number, x1: number, y1: number, color: Rgba) {
  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    setPixel(png, x0, y0, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawLineWithThickness(
  png: PNG,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  width: number,
  color: Rgba
) {
  const half = Math.floor(width / 2);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy);
  if (length === 0) {
    setPixel(png, Math.round(x0), Math.round(y0), color);
    return;
  }
  const offsetX = (-dy / length);
  const offsetY = (dx / length);

  for (let offset = -half; offset <= half; offset++) {
    const ox = offsetX * offset;
    const oy = offsetY * offset;
    drawLine(png, Math.round(x0 + ox), Math.round(y0 + oy), Math.round(x1 + ox), Math.round(y1 + oy), color);
  }
}

function drawDiamond(png: PNG, cx: number, cy: number, w: number, h: number, color: Rgba) {
  const top = { x: Math.round(cx), y: Math.round(cy - h / 2) };
  const right = { x: Math.round(cx + w / 2), y: Math.round(cy) };
  const bottom = { x: Math.round(cx), y: Math.round(cy + h / 2) };
  const left = { x: Math.round(cx - w / 2), y: Math.round(cy) };

  drawLine(png, top.x, top.y, right.x, right.y, color);
  drawLine(png, right.x, right.y, bottom.x, bottom.y, color);
  drawLine(png, bottom.x, bottom.y, left.x, left.y, color);
  drawLine(png, left.x, left.y, top.x, top.y, color);
}

function interpolate(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(a: Rgba, b: Rgba, t: number): Rgba {
  return {
    r: interpolate(a.r, b.r, t),
    g: interpolate(a.g, b.g, t),
    b: interpolate(a.b, b.b, t),
    a: interpolate(a.a ?? 255, b.a ?? 255, t),
  };
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

function fillVerticalGradient(png: PNG, top: Rgba, bottom: Rgba) {
  const isMultiRow = png.height > 1;
  const denom = isMultiRow ? png.height - 1 : 1;
  const rowColors = Array.from({ length: png.height }, (_, y) =>
    lerpColor(top, bottom, isMultiRow ? y / denom : 0)
  );

  for (let y = 0; y < png.height; y++) {
    const color = rowColors[y];
    for (let x = 0; x < png.width; x++) {
      setPixel(png, x, y, color);
    }
  }
}

function scatterTexture(png: PNG, density: number, color: Rgba, jitter = 0, prng: () => number = Math.random) {
  const total = Math.floor(png.width * png.height * density);
  for (let i = 0; i < total; i++) {
    const x = Math.floor(prng() * png.width);
    const y = Math.floor(prng() * png.height);
    const c = jitter
      ? {
          r: clampChannel(color.r + Math.floor((prng() - 0.5) * jitter)),
          g: clampChannel(color.g + Math.floor((prng() - 0.5) * jitter)),
          b: clampChannel(color.b + Math.floor((prng() - 0.5) * jitter)),
          a: color.a,
        }
      : color;
    setPixel(png, x, y, c);
  }
}

function paintRiver(png: PNG) {
  const riverColor: Rgba = { r: 59, g: 170, b: 222, a: 255 };
  const foamColor: Rgba = { r: 255, g: 255, b: 255, a: 160 };
  const centerX = Math.floor(png.width * 0.6);
  const bandWidth = 180;

  for (let y = 0; y < png.height; y++) {
    const wobble = Math.sin(y / RIVER_WOBBLE_FREQUENCY) * 30;
    const ribbonCenter = centerX + wobble - (y - png.height / 2) * RIVER_CURVE_FACTOR;
    const halfBand = bandWidth / 2;
    const startX = Math.max(0, Math.floor(ribbonCenter - halfBand));
    const endX = Math.min(png.width, Math.floor(ribbonCenter + halfBand));

    for (let x = startX; x < endX; x++) {
      const dist = Math.abs(x - ribbonCenter);
      const t = dist / halfBand;
      const color = lerpColor(riverColor, { r: 18, g: 120, b: 180, a: 255 }, t);
      setPixel(png, x, y, color);
      if (dist > halfBand * 0.9) {
        setPixel(png, x, y, foamColor);
      }
    }
  }
}

function paintCobbleCross(png: PNG) {
  const cobble: Rgba = { r: 210, g: 206, b: 196, a: 255 };
  const groutline: Rgba = { r: 130, g: 124, b: 112, a: 255 };
  const center = Math.floor(png.width / 2);

  drawLineWithThickness(png, center - 260, Math.floor(png.height * 0.35), center + 280, Math.floor(png.height * 0.65), 18, cobble);
  drawLineWithThickness(png, center - 250, Math.floor(png.height * 0.65), center + 240, Math.floor(png.height * 0.35), 18, cobble);
  drawLineWithThickness(png, center - 260, Math.floor(png.height * 0.35), center + 280, Math.floor(png.height * 0.65), 2, groutline);
  drawLineWithThickness(png, center - 250, Math.floor(png.height * 0.65), center + 240, Math.floor(png.height * 0.35), 2, groutline);
}

function paintWhisperKiosk(png: PNG) {
  const pad: Rgba = { r: 116, g: 90, b: 150, a: 230 };
  const glow: Rgba = { r: 180, g: 160, b: 215, a: 200 };
  const cx = Math.floor(png.width * 0.42);
  const cy = Math.floor(png.height * 0.48);
  const radius = 32;

  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const dist = Math.sqrt(x * x + y * y);
      if (dist <= radius) {
        const t = dist / radius;
        setPixel(png, cx + x, cy + y, lerpColor(glow, pad, t));
      }
    }
  }
}

function overlayIsoGrid(png: PNG) {
  const gridColor: Rgba = { r: 255, g: 255, b: 255, a: 50 };
  const originX = png.width / 2;
  const originY = TILE_HEIGHT;
  const cols = Math.ceil((png.width / TILE_WIDTH) * 2);
  const rows = Math.ceil((png.height / TILE_HEIGHT) * 2);

  for (let i = -cols; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const cx = originX + (i - j) * (TILE_WIDTH / 2);
      const cy = originY + (i + j) * (TILE_HEIGHT / 2);
      drawDiamond(png, cx, cy, TILE_WIDTH, TILE_HEIGHT, gridColor);
    }
  }
}

async function renderSegment0605(): Promise<{ atlas: Buffer; metadata: Record<string, unknown> }> {
  const png = new PNG({ width: ATLAS_SIZE, height: ATLAS_SIZE });
  const prng = createPrng(605);

  // Base Fairyglade to Rainbow Riverbank gradient
  fillVerticalGradient(
    png,
    { r: 110, g: 197, b: 128, a: 255 },
    { r: 74, g: 154, b: 202, a: 255 }
  );

  // Light meadow texture
  scatterTexture(png, 0.002, { r: 90, g: 170, b: 120, a: 255 }, 25, prng);
  scatterTexture(png, 0.0015, { r: 80, g: 140, b: 95, a: 255 }, 35, prng);

  // Rainbow Riverbank ribbon
  paintRiver(png);

  // Cobble Cross and kiosk marker
  paintCobbleCross(png);
  paintWhisperKiosk(png);

  // Overlay isometric grid
  overlayIsoGrid(png);

  const buffer = PNG.sync.write(png);

  const metadata = {
    areaId: HUB_AREA.id,
    name: HUB_AREA.name,
    baseTerrain: HUB_AREA.baseTerrain,
    locations: HUB_AREA.locations,
    image: { width: ATLAS_SIZE, height: ATLAS_SIZE, grid: { tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT } },
    perspective: 'isometric',
    tileScale: { horizontal: TILE_WIDTH, vertical: TILE_HEIGHT / 2, metersPerVerticalPixel: 1 / VERTICAL_PIXELS_PER_METER },
  };

  return { atlas: buffer, metadata };
}

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
export const generateAvatar = functions.https.onCall(async (request) => {
  const email = requireEmail(request.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId } = request.data as { characterId?: string; visualDescription?: string };

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
export const generateDraftSpriteSheet = functions.https.onCall(async (request) => {
  const email = requireEmail(request.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, templateType } = request.data as {
    characterId?: string;
    templateType?: string;
    visualDescription?: string;
    feedback?: string;
  };

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
export const finalizeSpriteSheet = functions.https.onCall(async (request) => {
  const email = requireEmail(request.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, draftPath } = request.data as { characterId?: string; draftPath?: string };

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
export const generateTileAtlas = functions.https.onCall(async (request) => {
  const email = requireEmail(request.auth?.token?.email);
  await assertIsAdmin(email);

  const { characterId, spriteSheetPath } = request.data as { characterId?: string; spriteSheetPath?: string };

  if (!characterId || !spriteSheetPath) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'characterId and spriteSheetPath are required'
    );
  }

  try {
    // TODO: Download sprite sheet from Storage when sprite generation is implemented
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

/**
 * Generate a world tile atlas for area segments (supports 06.05)
 */
export const generateAreaTileAtlas = functions.https.onCall(async (request) => {
  const email = requireEmail(request.auth?.token?.email);
  await assertIsAdmin(email);

  const { areaId } = request.data as { areaId?: string };
  if (!areaId || !SUPPORTED_AREAS.includes(areaId)) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid areaId. Only area ${HUB_AREA.id} (${HUB_AREA.name}) is currently supported.`);
  }

  const bucket = admin.storage().bucket();
  const now = Date.now();
  const atlasPath = `atlases/areas/${areaId}/atlas-${now}.png`;
  const metadataPath = `atlases/areas/${areaId}/atlas-${now}.json`;
  const draftId = `draft-${now}`;

  try {
    const { atlas, metadata } = await renderSegment0605();
    const atlasFile = bucket.file(atlasPath);
    await atlasFile.save(atlas, { contentType: 'image/png' });

    const metadataFile = bucket.file(metadataPath);
    const metadataWithDraft = {
      ...metadata,
      draftId,
      status: DRAFT_STATUS,
      generatedAt: new Date(now).toISOString(),
      storage: { atlasPath, metadataPath },
    };
    await metadataFile.save(Buffer.from(JSON.stringify(metadataWithDraft, null, 2)), {
      contentType: 'application/json',
    });

    const firestore = admin.firestore();
    const areaRef = firestore.collection('areas').doc(areaId);
    await areaRef.set(
      {
        ...HUB_AREA,
        latestAtlasPath: atlasPath,
        latestMetadataPath: metadataPath,
        status: DRAFT_STATUS,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await areaRef.collection('drafts').doc(draftId).set({
      draftId,
      atlasPath,
      metadataPath,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: DRAFT_STATUS,
      notes: 'Auto-generated segment 06.05 tile atlas draft',
    });

    functions.logger.info(`Generated area atlas for ${areaId}`, { atlasPath, metadataPath });

    return {
      success: true,
      message: 'Area tile atlas draft generated and saved to Storage',
      atlasPath,
      metadataPath,
      draftId,
    };
  } catch (error) {
    functions.logger.error('Error generating area tile atlas:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate area tile atlas');
  }
});
