import { minimatch } from 'minimatch';

const textDecoder = new TextDecoder();

const LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';

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

export function isLfsTracked(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => minimatch(path, pattern, { matchBase: true }));
}

export function isLfsPointer(content: Uint8Array): boolean {
  if (content.byteLength > 200 || content.byteLength < 50) return false;
  const text = textDecoder.decode(content.slice(0, LFS_POINTER_PREFIX.length));
  return text === LFS_POINTER_PREFIX;
}

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

export async function processLfsAdditions(
  additions: { path: string; contents: Uint8Array }[],
  patterns: string[]
): Promise<{ path: string; contents: Uint8Array }[]> {
  const lfsIndices: number[] = [];
  for (let i = 0; i < additions.length; i++) {
    if (isLfsTracked(additions[i].path, patterns)) {
      lfsIndices.push(i);
    }
  }

  if (lfsIndices.length === 0) return additions;

  const response = await fetch('/api/keystatic/github/lfs/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objects: lfsIndices.map(i => ({
        content: uint8ArrayToBase64(additions[i].contents),
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`LFS upload failed: ${await response.text()}`);
  }

  const data: { objects: Array<{ pointer: string }> } = await response.json();
  const result = [...additions];
  for (let i = 0; i < lfsIndices.length; i++) {
    const idx = lfsIndices[i];
    result[idx] = {
      path: additions[idx].path,
      contents: base64ToUint8Array(data.objects[i].pointer),
    };
  }

  return result;
}

export async function resolveLfsPointers(
  blobs: Map<string, Uint8Array>
): Promise<Map<string, Uint8Array>> {
  const pointerEntries: { path: string; raw: Uint8Array }[] = [];

  for (const [path, content] of blobs) {
    if (isLfsPointer(content)) {
      pointerEntries.push({ path, raw: content });
    }
  }

  if (pointerEntries.length === 0) return blobs;

  const resolved = new Map(blobs);
  const downloads = pointerEntries.map(async entry => {
    const encoded = encodeURIComponent(uint8ArrayToBase64(entry.raw));
    const response = await fetch(
      `/api/keystatic/github/lfs/download/${encoded}`
    );
    if (!response.ok) return;
    resolved.set(entry.path, new Uint8Array(await response.arrayBuffer()));
  });

  await Promise.all(downloads);
  return resolved;
}
