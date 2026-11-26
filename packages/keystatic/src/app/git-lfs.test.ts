/** @jest-environment node */
import { webcrypto } from 'node:crypto';
import { expect, test, describe } from '@jest/globals';
import {
  parseGitAttributes,
  isLfsTracked,
  isLfsPointer,
  createLfsPointer,
  parseLfsPointer,
} from './git-lfs';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

const textEncoder = new TextEncoder();

function makeLfsPointer(oid: string, size: number): Uint8Array {
  return textEncoder.encode(createLfsPointer(oid, size));
}

describe('parseGitAttributes', () => {
  test('extracts LFS patterns from standard .gitattributes', () => {
    const content = [
      '*.png filter=lfs diff=lfs merge=lfs -text',
      '*.jpg filter=lfs diff=lfs merge=lfs -text',
      '*.md text',
    ].join('\n');
    expect(parseGitAttributes(content)).toEqual(['*.png', '*.jpg']);
  });

  test('ignores lines without all three LFS attributes', () => {
    const content = '*.png filter=lfs diff=lfs -text';
    expect(parseGitAttributes(content)).toEqual([]);
  });

  test('ignores comments and blank lines', () => {
    const content = [
      '# This is a comment',
      '',
      '*.bin filter=lfs diff=lfs merge=lfs -text',
      '*.md text # not lfs',
    ].join('\n');
    expect(parseGitAttributes(content)).toEqual(['*.bin']);
  });

  test('handles inline comments after LFS attributes', () => {
    const content = '*.psd filter=lfs diff=lfs merge=lfs -text # large files';
    expect(parseGitAttributes(content)).toEqual(['*.psd']);
  });

  test('returns empty array for empty content', () => {
    expect(parseGitAttributes('')).toEqual([]);
  });
});

describe('isLfsTracked', () => {
  const patterns = ['*.png', '*.jpg', 'assets/**/*.gif'];

  test('matches simple extension pattern', () => {
    expect(isLfsTracked('images/photo.png', patterns)).toBe(true);
    expect(isLfsTracked('deep/nested/file.jpg', patterns)).toBe(true);
  });

  test('does not match non-tracked extensions', () => {
    expect(isLfsTracked('README.md', patterns)).toBe(false);
    expect(isLfsTracked('src/app.ts', patterns)).toBe(false);
  });

  test('matches glob patterns with directories', () => {
    expect(isLfsTracked('assets/icons/icon.gif', patterns)).toBe(true);
  });

  test('does not match outside glob scope', () => {
    expect(isLfsTracked('other/icon.gif', patterns)).toBe(false);
  });

  test('returns false for empty patterns', () => {
    expect(isLfsTracked('file.png', [])).toBe(false);
  });
});

describe('isLfsPointer', () => {
  const sampleOid =
    'abc123def456abc123def456abc123def456abc123def456abc123def456abcd1234';
  const sampleSize = 12345;

  test('detects valid pointer', () => {
    const pointer = makeLfsPointer(sampleOid, sampleSize);
    expect(isLfsPointer(pointer)).toBe(true);
  });

  test('rejects non-pointer content', () => {
    expect(isLfsPointer(textEncoder.encode('hello world'))).toBe(false);
    expect(isLfsPointer(new Uint8Array(300))).toBe(false);
    expect(isLfsPointer(new Uint8Array(10))).toBe(false);
  });

  test('detects pointer with varying oid and size', () => {
    const oid =
      '0000000000000000000000000000000000000000000000000000000000000000';
    const pointer = makeLfsPointer(oid, 999999);
    expect(isLfsPointer(pointer)).toBe(true);
  });
});

describe('parseLfsPointer', () => {
  test('parses a valid pointer', () => {
    const oid =
      'abc123def456abc123def456abc123def456abc123def456abc123def456abcd1234';
    const size = 999999;
    const text = createLfsPointer(oid, size);
    expect(parseLfsPointer(text)).toEqual({ oid, size });
  });

  test('throws on missing oid', () => {
    const text = 'version https://git-lfs.github.com/spec/v1\nsize 100\n';
    expect(() => parseLfsPointer(text)).toThrow('missing or invalid oid');
  });

  test('throws on invalid oid prefix', () => {
    const text =
      'version https://git-lfs.github.com/spec/v1\noid md5:abc123\nsize 100\n';
    expect(() => parseLfsPointer(text)).toThrow('missing or invalid oid');
  });

  test('throws on missing size', () => {
    const text = `version https://git-lfs.github.com/spec/v1\noid sha256:abc123\n`;
    expect(() => parseLfsPointer(text)).toThrow('missing size');
  });
});
