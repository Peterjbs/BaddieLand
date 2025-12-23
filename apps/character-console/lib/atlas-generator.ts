export interface AtlasFrame {
  filename: string;
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

export interface AtlasMetadata {
  frames: Record<string, AtlasFrame>;
  meta: {
    app: string;
    version: string;
    image: string;
    format: string;
    size: { w: number; h: number };
    scale: string;
  };
}

/**
 * Generate a tile atlas from a sprite sheet
 * This is a placeholder implementation - full implementation would require
 * image processing libraries like Sharp or Canvas
 */
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
  // const response = await fetch(spriteSheetUrl);
  // const buffer = await response.arrayBuffer();

  // Extract frames from sprite sheet
  const frames: Record<string, AtlasFrame> = {};
  let frameIndex = 0;

  for (let row = 0; row < template.rows; row++) {
    for (let col = 0; col < template.cols; col++) {
      const frameName = `${characterId}_frame_${frameIndex.toString().padStart(3, '0')}.png`;
      frames[frameName] = {
        filename: frameName,
        frame: {
          x: col * template.frameWidth,
          y: row * template.frameHeight,
          w: template.frameWidth,
          h: template.frameHeight,
        },
        rotated: false,
        trimmed: false,
        spriteSourceSize: {
          x: 0,
          y: 0,
          w: template.frameWidth,
          h: template.frameHeight,
        },
        sourceSize: {
          w: template.frameWidth,
          h: template.frameHeight,
        },
      };
      frameIndex++;
    }
  }

  const metadata: AtlasMetadata = {
    frames,
    meta: {
      app: 'BaddieLand Character Console',
      version: '1.0',
      image: `${characterId}_atlas.png`,
      format: 'RGBA8888',
      size: {
        w: template.cols * template.frameWidth,
        h: template.rows * template.frameHeight,
      },
      scale: '1',
    },
  };

  // For now, return placeholder buffer
  // In a real implementation, this would:
  // 1. Use Sharp or Canvas to extract individual frames
  // 2. Use a bin-packing algorithm to efficiently pack frames
  // 3. Generate the final atlas image
  const placeholderBuffer = Buffer.from('');

  return {
    atlasImageBuffer: placeholderBuffer,
    metadata,
  };
}

/**
 * Simple bin-packing algorithm for efficient sprite packing
 * This is a simplified implementation
 */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

class BinPacker {
  private width: number;
  private height: number;
  private rects: Rect[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  pack(width: number, height: number): Rect | null {
    // Simple shelf packing algorithm
    let bestY = this.height;
    let bestX = 0;
    let bestHeight = height;

    for (let y = 0; y <= this.height - height; y++) {
      let x = 0;
      let shelfHeight = 0;

      for (const rect of this.rects) {
        if (rect.y <= y && rect.y + rect.h > y) {
          x = Math.max(x, rect.x + rect.w);
          shelfHeight = Math.max(shelfHeight, rect.h);
        }
      }

      if (x + width <= this.width) {
        if (y < bestY || (y === bestY && shelfHeight < bestHeight)) {
          bestY = y;
          bestX = x;
          bestHeight = shelfHeight;
        }
      }
    }

    if (bestY + height <= this.height) {
      const rect = { x: bestX, y: bestY, w: width, h: height };
      this.rects.push(rect);
      return rect;
    }

    return null;
  }
}
