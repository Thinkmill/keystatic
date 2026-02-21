import { minimatch } from 'minimatch';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';
const LFS_ENDPOINT = '/api/keystatic/github/lfs';

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

// Base64 utilities
// ----------------------------------------------------------------------------

function uint8ArrayToBase64(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.byteLength; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Server-backed LFS operations
// ----------------------------------------------------------------------------

export async function processLfsAdditions(
  additions: { path: string; contents: Uint8Array }[],
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

  const response = await fetch(LFS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operation: 'upload',
      objects: lfsAdditions.map(a => ({
        oid: a.oid,
        size: a.size,
        content: uint8ArrayToBase64(a.contents),
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`LFS upload failed: ${await response.text()}`);
  }

  for (const lfsAddition of lfsAdditions) {
    result[lfsAddition.index] = {
      path: additions[lfsAddition.index].path,
      contents: createLfsPointer(lfsAddition.oid, lfsAddition.size),
    };
  }

  return result;
}

export async function resolveLfsPointers(
  blobs: Map<string, Uint8Array>
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

  const response = await fetch(LFS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operation: 'download',
      objects: pointers.map(p => ({ oid: p.oid, size: p.size })),
    }),
  });

  if (!response.ok) {
    throw new Error(`LFS download failed: ${await response.text()}`);
  }

  const data: { objects: Array<{ oid: string; content: string }> } =
    await response.json();
  const downloaded = new Map<string, Uint8Array>();
  for (const obj of data.objects) {
    downloaded.set(obj.oid, base64ToUint8Array(obj.content));
  }

  const resolved = new Map(blobs);
  for (const pointer of pointers) {
    const content = downloaded.get(pointer.oid);
    if (content) {
      resolved.set(pointer.path, content);
    }
  }

  return resolved;
}
