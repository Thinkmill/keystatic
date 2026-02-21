import { minimatch } from 'minimatch';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';
const LFS_PROXY_PATH = '/api/keystatic/github/lfs';

// LFS proxy — all requests go through the server to avoid CORS
// ----------------------------------------------------------------------------

async function lfsProxyFetch(
  url: string,
  init: RequestInit
): Promise<Response> {
  return fetch(LFS_PROXY_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      method: init.method ?? 'GET',
      headers: init.headers ?? {},
      body: init.body != null ? uint8ArrayToBase64(init.body) : undefined,
    }),
  });
}

function uint8ArrayToBase64(data: unknown): string {
  const bytes =
    data instanceof Uint8Array ? data : new Uint8Array(data as ArrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// .gitattributes parsing
// ----------------------------------------------------------------------------

export function parseGitAttributes(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.split('#')[0].trim())
    .filter(line => line.length > 0)
    .flatMap(line => {
      const [pattern, ...attributes] = line.split(/\s+/);
      if (!pattern) return [];
      const attrs = parseAttributes(attributes);
      if (
        attrs.get('filter') === 'lfs' &&
        attrs.get('diff') === 'lfs' &&
        attrs.get('merge') === 'lfs'
      ) {
        return [pattern];
      }
      return [];
    });
}

function parseAttributes(parts: string[]): Map<string, string | boolean> {
  const attrs = new Map<string, string | boolean>();
  for (const part of parts) {
    if (part.includes('=')) {
      const [key, value] = part.split('=', 2);
      attrs.set(key, value);
    } else if (part.startsWith('-')) {
      attrs.set(part.slice(1), false);
    } else {
      attrs.set(part, true);
    }
  }
  return attrs;
}

// Pattern matching
// ----------------------------------------------------------------------------

export function isLfsTracked(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => minimatch(path, pattern, { matchBase: true }));
}

// Pointer operations
// ----------------------------------------------------------------------------

export function isLfsPointer(content: Uint8Array): boolean {
  if (content.byteLength > 200 || content.byteLength < 50) return false;
  const text = textDecoder.decode(content.slice(0, LFS_POINTER_PREFIX.length));
  return text === LFS_POINTER_PREFIX;
}

export function parseLfsPointer(content: Uint8Array): {
  oid: string;
  size: number;
} {
  const text = textDecoder.decode(content);
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const pairs = new Map<string, string>();
  for (const line of lines) {
    const spaceIdx = line.indexOf(' ');
    if (spaceIdx !== -1) {
      pairs.set(line.slice(0, spaceIdx), line.slice(spaceIdx + 1));
    }
  }

  const oidRaw = pairs.get('oid');
  if (!oidRaw?.startsWith('sha256:')) {
    throw new Error(`Invalid LFS pointer: missing or invalid oid`);
  }
  const sizeRaw = pairs.get('size');
  if (!sizeRaw) {
    throw new Error(`Invalid LFS pointer: missing size`);
  }

  return {
    oid: oidRaw.slice('sha256:'.length),
    size: parseInt(sizeRaw, 10),
  };
}

export function createLfsPointer(oid: string, size: number): Uint8Array {
  const text = `version https://git-lfs.github.com/spec/v1\noid sha256:${oid}\nsize ${size}\n`;
  return textEncoder.encode(text);
}

// SHA-256
// ----------------------------------------------------------------------------

async function computeSha256(content: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', content as unknown as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// LFS Batch API
// ----------------------------------------------------------------------------

type LfsBatchObject = { oid: string; size: number };

type LfsBatchResponseObject = {
  oid: string;
  size: number;
  authenticated?: boolean;
  actions?: {
    upload?: { href: string; header?: Record<string, string> };
    download?: { href: string; header?: Record<string, string> };
    verify?: { href: string; header?: Record<string, string> };
  };
  error?: { code: number; message: string };
};

type LfsBatchResponse = {
  transfer?: string;
  objects: LfsBatchResponseObject[];
};

async function lfsBatchRequest(
  owner: string,
  repo: string,
  _token: string,
  operation: 'upload' | 'download',
  objects: LfsBatchObject[]
): Promise<LfsBatchResponse> {
  const url = `https://github.com/${owner}/${repo}.git/info/lfs/objects/batch`;
  const response = await lfsProxyFetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.git-lfs+json',
      'Content-Type': 'application/vnd.git-lfs+json',
    },
    body: textEncoder.encode(
      JSON.stringify({
        operation,
        transfers: ['basic'],
        objects,
      })
    ),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `LFS batch API error (${response.status}): ${body}`
    );
  }
  return response.json();
}

async function lfsUploadObjects(
  batchResponse: LfsBatchResponse,
  objectContents: Map<string, Uint8Array>
): Promise<void> {
  for (const obj of batchResponse.objects) {
    if (obj.error) {
      throw new Error(
        `LFS server error for ${obj.oid}: ${obj.error.message} (${obj.error.code})`
      );
    }
    const uploadAction = obj.actions?.upload;
    if (!uploadAction) continue; // server already has this object

    const content = objectContents.get(obj.oid);
    if (!content) {
      throw new Error(`Missing content for LFS object ${obj.oid}`);
    }

    const uploadResponse = await lfsProxyFetch(uploadAction.href, {
      method: 'PUT',
      headers: uploadAction.header ?? {},
      body: content as unknown as BodyInit,
    });

    if (!uploadResponse.ok) {
      const body = await uploadResponse.text();
      throw new Error(
        `LFS upload failed for ${obj.oid} (${uploadResponse.status}): ${body}`
      );
    }

    if (obj.actions?.verify) {
      const verifyResponse = await lfsProxyFetch(obj.actions.verify.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.git-lfs+json',
          ...(obj.actions.verify.header ?? {}),
        },
        body: textEncoder.encode(
          JSON.stringify({ oid: obj.oid, size: obj.size })
        ),
      });
      if (!verifyResponse.ok) {
        const body = await verifyResponse.text();
        throw new Error(
          `LFS verify failed for ${obj.oid} (${verifyResponse.status}): ${body}`
        );
      }
    }
  }
}

async function lfsDownloadObjects(
  batchResponse: LfsBatchResponse
): Promise<Map<string, Uint8Array>> {
  const results = new Map<string, Uint8Array>();
  for (const obj of batchResponse.objects) {
    if (obj.error) {
      console.warn(
        `LFS download error for ${obj.oid}: ${obj.error.message} (${obj.error.code})`
      );
      continue;
    }
    const downloadAction = obj.actions?.download;
    if (!downloadAction) {
      console.warn(`No download action for LFS object ${obj.oid}`);
      continue;
    }
    const response = await lfsProxyFetch(downloadAction.href, {
      headers: downloadAction.header ?? {},
    });
    if (!response.ok) {
      console.warn(
        `LFS download failed for ${obj.oid} (${response.status})`
      );
      continue;
    }
    const buffer = await response.arrayBuffer();
    results.set(obj.oid, new Uint8Array(buffer));
  }
  return results;
}

// High-level orchestrators
// ----------------------------------------------------------------------------

export async function processLfsAdditions(
  additions: { path: string; contents: Uint8Array }[],
  owner: string,
  repo: string,
  token: string,
  patterns: string[]
): Promise<{ path: string; contents: Uint8Array }[]> {
  const lfsAdditions: {
    index: number;
    oid: string;
    size: number;
    contents: Uint8Array;
  }[] = [];

  const result = [...additions];

  for (let i = 0; i < additions.length; i++) {
    const addition = additions[i];
    if (isLfsTracked(addition.path, patterns)) {
      const oid = await computeSha256(addition.contents);
      lfsAdditions.push({
        index: i,
        oid,
        size: addition.contents.byteLength,
        contents: addition.contents,
      });
    }
  }

  if (lfsAdditions.length === 0) return result;

  const objectContents = new Map(
    lfsAdditions.map(a => [a.oid, a.contents])
  );

  const batchResponse = await lfsBatchRequest(
    owner,
    repo,
    token,
    'upload',
    lfsAdditions.map(a => ({ oid: a.oid, size: a.size }))
  );

  await lfsUploadObjects(batchResponse, objectContents);

  for (const lfsAddition of lfsAdditions) {
    result[lfsAddition.index] = {
      path: additions[lfsAddition.index].path,
      contents: createLfsPointer(lfsAddition.oid, lfsAddition.size),
    };
  }

  return result;
}

export async function resolveLfsPointers(
  blobs: Map<string, Uint8Array>,
  owner: string,
  repo: string,
  token: string
): Promise<Map<string, Uint8Array>> {
  const pointers: { path: string; oid: string; size: number }[] = [];

  for (const [path, content] of blobs) {
    if (isLfsPointer(content)) {
      try {
        const { oid, size } = parseLfsPointer(content);
        pointers.push({ path, oid, size });
      } catch {
        // not a valid pointer — treat as a normal file
      }
    }
  }

  if (pointers.length === 0) return blobs;

  const batchResponse = await lfsBatchRequest(
    owner,
    repo,
    token,
    'download',
    pointers.map(p => ({ oid: p.oid, size: p.size }))
  );

  const downloaded = await lfsDownloadObjects(batchResponse);

  const resolved = new Map(blobs);
  for (const pointer of pointers) {
    const content = downloaded.get(pointer.oid);
    if (content) {
      resolved.set(pointer.path, content);
    }
  }

  return resolved;
}
