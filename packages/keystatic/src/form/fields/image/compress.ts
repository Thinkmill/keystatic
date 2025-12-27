import imageCompression from 'browser-image-compression';

export type ImageCompressionConfig = {
  /** Maximum width in pixels. Image will be resized proportionally. */
  maxWidth?: number;
  /** Maximum height in pixels. Image will be resized proportionally. */
  maxHeight?: number;
  /** Maximum file size in bytes (e.g., 1048576 for 1MB). */
  maxFileSize?: number;
  /** Quality for lossy formats (0-1). Default: 0.8 */
  quality?: number;
  /** Output format. 'preserve' keeps original, 'webp' or 'jpeg' converts. Default: 'preserve' */
  format?: 'preserve' | 'webp' | 'jpeg';
};

export type CompressionResult = {
  data: Uint8Array;
  extension: string;
  originalSize: number;
  compressedSize: number;
};

function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return map[mimeType] || 'jpg';
}

function getMimeTypeFromExtension(extension: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
  };
  return map[extension.toLowerCase()] || 'image/jpeg';
}

function getOutputMimeType(
  originalExtension: string,
  format: ImageCompressionConfig['format']
): string {
  if (!format || format === 'preserve') {
    return getMimeTypeFromExtension(originalExtension);
  }
  return format === 'webp' ? 'image/webp' : 'image/jpeg';
}

/**
 * Compresses an image file according to the provided configuration.
 * Returns the original file data if compression fails or produces a larger file.
 */
export async function compressImage(
  file: File,
  config: ImageCompressionConfig
): Promise<CompressionResult> {
  const originalSize = file.size;
  const originalExtension =
    file.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase() || 'jpg';

  // Skip SVG (vector) and GIF (may lose animation) files
  if (
    originalExtension === 'svg' ||
    originalExtension === 'gif' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    const data = new Uint8Array(await file.arrayBuffer());
    return {
      data,
      extension: originalExtension,
      originalSize,
      compressedSize: originalSize,
    };
  }

  const outputMimeType = getOutputMimeType(originalExtension, config.format);
  const outputExtension = getExtensionFromMimeType(outputMimeType);

  try {
    // Use the smaller of maxWidth/maxHeight to ensure both constraints are satisfied
    // browser-image-compression only supports a single maxWidthOrHeight value
    const maxDimensions = [config.maxWidth, config.maxHeight].filter(
      (v): v is number => v !== undefined && v > 0
    );
    const maxWidthOrHeight =
      maxDimensions.length > 0 ? Math.min(...maxDimensions) : undefined;

    const options: Parameters<typeof imageCompression>[1] = {
      maxSizeMB: config.maxFileSize
        ? config.maxFileSize / 1024 / 1024
        : undefined,
      maxWidthOrHeight,
      initialQuality: config.quality ?? 0.8,
      useWebWorker: true,
      fileType: outputMimeType,
    };

    const compressedFile = await imageCompression(file, options);
    const compressedSize = compressedFile.size;

    // If compression made the file larger, return original
    if (compressedSize >= originalSize) {
      const data = new Uint8Array(await file.arrayBuffer());
      return {
        data,
        extension: originalExtension,
        originalSize,
        compressedSize: originalSize,
      };
    }

    const data = new Uint8Array(await compressedFile.arrayBuffer());
    return {
      data,
      extension: outputExtension,
      originalSize,
      compressedSize,
    };
  } catch {
    // On any error, return original file (silent fallback)
    const data = new Uint8Array(await file.arrayBuffer());
    return {
      data,
      extension: originalExtension,
      originalSize,
      compressedSize: originalSize,
    };
  }
}

/**
 * Format bytes as human-readable string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
