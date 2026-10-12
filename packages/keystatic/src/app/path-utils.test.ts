/** @jest-environment node */
import { expect, test } from '@jest/globals';
import { normalizePosixPath } from './path-utils';

test('normalizePosixPath resolves a single .. segment', () => {
  expect(normalizePosixPath('a/b/../c')).toBe('a/c');
});

test('normalizePosixPath resolves consecutive .. segments', () => {
  expect(normalizePosixPath('a/b/c/../../d')).toBe('a/d');
});

test('normalizePosixPath drops . segments', () => {
  expect(normalizePosixPath('a/./b/./c')).toBe('a/b/c');
});

test('normalizePosixPath collapses consecutive slashes', () => {
  expect(normalizePosixPath('a//b///c')).toBe('a/b/c');
});

test('normalizePosixPath preserves leading .. when no parent to resolve against', () => {
  expect(normalizePosixPath('../a/b')).toBe('../a/b');
});

test('normalizePosixPath preserves multiple leading .. segments', () => {
  expect(normalizePosixPath('../../a')).toBe('../../a');
});

test('normalizePosixPath drops .. at the root of an absolute path', () => {
  expect(normalizePosixPath('/../a')).toBe('/a');
});

test('normalizePosixPath leaves an already-clean relative path alone', () => {
  expect(normalizePosixPath('a/b/c.txt')).toBe('a/b/c.txt');
});

test('normalizePosixPath leaves an already-clean absolute path alone', () => {
  expect(normalizePosixPath('/a/b/c.txt')).toBe('/a/b/c.txt');
});

test('normalizePosixPath handles the realistic Keystatic update case', () => {
  // The bug case: a markdoc body in `src/content/blog/{slug}.mdoc`
  // references an image at `../../assets/blog/x.png`. Keystatic's
  // editor concatenates the entry base path, the slug, the field name,
  // and the image's relative reference into a single wire-format path:
  //   src/content/blog/{slug}/content/../../assets/blog/x.png
  // Before this fix that string was sent verbatim and failed the
  // `getIsPathValid` refinement on its `..` segments. After this fix
  // it resolves the `..` segments and a valid path reaches the API.
  expect(
    normalizePosixPath(
      'src/content/blog/my-post/content/../../assets/blog/x.png'
    )
  ).toBe('src/content/blog/assets/blog/x.png');
});
