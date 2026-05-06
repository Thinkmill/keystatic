import { minimatch } from 'minimatch';
import { base64Decode, base64Encode } from '#base64';

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
  const text = textDecoder.decode(content.slice(0, LFS_POINTER_PREFIX.length));
  return text === LFS_POINTER_PREFIX;
}

export function parseLfsPointer(text: string): { oid: string; size: number } {
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
    throw new Error('Invalid LFS pointer: missing or invalid oid');
  }
  const sizeRaw = pairs.get('size');
  if (!sizeRaw) {
    throw new Error('Invalid LFS pointer: missing size');
  }
  return { oid: oidRaw.slice('sha256:'.length), size: parseInt(sizeRaw, 10) };
}

export function createLfsPointer(oid: string, size: number): string {
  return `${LFS_POINTER_PREFIX}\noid sha256:${oid}\nsize ${size}\n`;
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
        content: base64Encode(additions[i].contents),
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
      contents: base64Decode(data.objects[i].pointer),
    };
  }

  return result;
}


