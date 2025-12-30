/**
 * Git LFS Client for Keystatic
 *
 * Enables binary files to be stored on a custom LFS server instead of
 * being base64-encoded directly into Git commits.
 *
 * @see https://github.com/git-lfs/git-lfs/blob/main/docs/api/batch.md
 */

const LFS_CONTENT_TYPE = 'application/vnd.git-lfs+json';

/** Maximum retry attempts for LFS uploads */
const MAX_RETRIES = 3;

/** Base delay for exponential backoff (ms) */
const BASE_DELAY = 1000;

// ============================================================================
// Types
// ============================================================================

export interface LfsConfig {
  /** Enable LFS support */
  enabled: boolean
  /**
   * Proxy endpoint that handles LFS batch requests with server-side credentials.
   * The proxy receives the batch request, injects R2 credentials, and forwards
   * to the LFS server. Bucket is passed as a query parameter.
   * @default '/api/keystatic/lfs/batch'
   * @example '/api/lfs/batch'
   */
  proxyEndpoint?: string
  /** R2 bucket name (passed to proxy as query parameter) */
  bucket: string
  /** File size threshold in bytes (default: 0 = all matched files) */
  fileSizeThreshold?: number
  /** File patterns to use LFS for (default: common binary patterns) */
  patterns?: string[]
}

interface LfsBatchRequest {
  operation: 'upload' | 'download'
  objects: Array<{ oid: string; size: number }>
  hash_algo?: string
}

interface LfsBatchResponse {
  transfer?: string
  hash_algo?: string
  objects: Array<{
    oid: string
    size: number
    authenticated?: boolean
    actions?: {
      upload?: { href: string; expires_in?: number }
      download?: { href: string; expires_in?: number }
    }
    error?: { code: number; message: string }
  }>
}

export class LfsUploadError extends Error {
  constructor(
    message: string,
    public readonly oid: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'LfsUploadError';
  }
}

// ============================================================================
// Default Patterns
// ============================================================================

/** Default patterns matching common .gitattributes LFS patterns */
const DEFAULT_LFS_PATTERNS = [
  // Images
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.gif',
  '*.webp',
  '*.ico',
  '*.svg',
  '*.tiff',
  '*.tif',
  '*.bmp',
  // Video
  '*.mp4',
  '*.webm',
  '*.mov',
  '*.avi',
  // Documents
  '*.pdf',
  // Archives
  '*.zip',
  '*.tar.gz',
  // Fonts
  '*.woff',
  '*.woff2',
];

// ============================================================================
// LFS Operations
// ============================================================================

/**
 * Calculate SHA256 hash of content (Git LFS uses SHA256 for object IDs)
 */
export async function calculateSha256(content: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', content);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create an LFS pointer file content
 * @see https://github.com/git-lfs/git-lfs/blob/main/docs/spec.md
 */
export function createLfsPointer(oid: string, size: number): string {
  return `version https://git-lfs.github.com/spec/v1
oid sha256:${oid}
size ${size}
`;
}

/**
 * Check if a file path matches LFS patterns
 */
export function shouldUseLfs(
  path: string,
  size: number,
  config: LfsConfig
): boolean {
  if (!config.enabled) return false;

  // Check file size threshold
  if (config.fileSizeThreshold && size < config.fileSizeThreshold) {
    return false;
  }

  const patterns = config.patterns ?? DEFAULT_LFS_PATTERNS;
  const ext = path.substring(path.lastIndexOf('.'));

  return patterns.some((pattern) => {
    if (pattern.startsWith('*.')) {
      return ext === pattern.slice(1);
    }
    return path.endsWith(pattern);
  });
}

/**
 * Sleep for a given duration (for retry backoff)
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build the proxy batch URL with bucket parameter
 */
function buildProxyBatchUrl(config: LfsConfig): string {
  return `${config.proxyEndpoint || '/api/keystatic/lfs/batch'}?bucket=${encodeURIComponent(config.bucket)}`;
}

/**
 * Upload a file to the LFS server with retry logic.
 * Uses the proxy endpoint which injects credentials server-side.
 */
export async function uploadToLfs(
  config: LfsConfig,
  file: { content: Uint8Array; oid: string }
): Promise<void> {
  const batchUrl = buildProxyBatchUrl(config);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 1. Request upload URL from batch API via proxy
      const batchResponse = await fetch(batchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': LFS_CONTENT_TYPE,
          Accept: LFS_CONTENT_TYPE,
        },
        body: JSON.stringify({
          operation: 'upload',
          objects: [{ oid: file.oid, size: file.content.byteLength }],
          hash_algo: 'sha256',
        } satisfies LfsBatchRequest),
      });

      if (!batchResponse.ok) {
        throw new Error(
          `LFS batch request failed: ${batchResponse.status} ${batchResponse.statusText}`
        );
      }

      const batch: LfsBatchResponse = await batchResponse.json();
      const obj = batch.objects[0];

      if (!obj) {
        throw new Error('LFS batch response missing object');
      }

      if (obj.error) {
        throw new Error(`LFS error: ${obj.error.message} (code: ${obj.error.code})`);
      }

      // 2. If actions.upload exists, upload the file directly to signed URL
      if (obj.actions?.upload) {
        // Must send Content-Type matching what was signed in presigned URL
        const uploadResponse = await fetch(obj.actions.upload.href, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: file.content,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `LFS upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
          );
        }
      }

      // If no actions, server already has the file - success!

      return;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = BASE_DELAY * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }

  throw new LfsUploadError(
    `Failed to upload to LFS after ${MAX_RETRIES} attempts`,
    file.oid,
    lastError
  );
}

/**
 * Download a file from the LFS server.
 * Uses the proxy endpoint which injects credentials server-side.
 */
export async function downloadFromLfs(
  config: LfsConfig,
  oid: string,
  size: number
): Promise<Uint8Array> {
  const batchUrl = buildProxyBatchUrl(config);

  // 1. Request download URL from batch API via proxy
  const batchResponse = await fetch(batchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': LFS_CONTENT_TYPE,
      Accept: LFS_CONTENT_TYPE,
    },
    body: JSON.stringify({
      operation: 'download',
      objects: [{ oid, size }],
      hash_algo: 'sha256',
    } satisfies LfsBatchRequest),
  });

  if (!batchResponse.ok) {
    throw new Error(
      `LFS batch request failed: ${batchResponse.status} ${batchResponse.statusText}`
    );
  }

  const batch: LfsBatchResponse = await batchResponse.json();
  const obj = batch.objects[0];

  if (!obj) {
    throw new Error('LFS batch response missing object');
  }

  if (obj.error) {
    throw new Error(`LFS error: ${obj.error.message} (code: ${obj.error.code})`);
  }

  if (!obj.actions?.download) {
    throw new Error('LFS object has no download action');
  }

  // 2. Download the file directly from signed URL
  const downloadResponse = await fetch(obj.actions.download.href);

  if (!downloadResponse.ok) {
    throw new Error(
      `LFS download failed: ${downloadResponse.status} ${downloadResponse.statusText}`
    );
  }

  const buffer = await downloadResponse.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Parse an LFS pointer file content
 * Returns null if not a valid LFS pointer
 */
export function parseLfsPointer(
  content: Uint8Array
): { oid: string; size: number } | null {
  // LFS pointers are <1024 bytes
  if (content.byteLength > 1024) return null;

  const text = new TextDecoder().decode(content);
  const lines = text.split('\n');

  // Must start with version line
  if (!lines[0]?.startsWith('version https://git-lfs.github.com/spec/v1')) {
    return null;
  }

  let oid: string | null = null;
  let size: number | null = null;

  for (const line of lines) {
    if (line.startsWith('oid sha256:')) {
      oid = line.slice('oid sha256:'.length);
    } else if (line.startsWith('size ')) {
      size = parseInt(line.slice('size '.length), 10);
    }
  }

  if (!oid || size === null || isNaN(size)) {
    return null;
  }

  return { oid, size };
}
