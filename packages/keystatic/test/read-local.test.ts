/** @jest-environment node */
import { TreeEntry } from '../src/app/trees';
import { readToDirEntries } from '../src/api/read-local';
import { testdir } from './test-utils';
import { expect, test } from '@jest/globals';

function short(output: TreeEntry[]) {
  const obj = Object.fromEntries(output.map(o => [o.path, o.type]));
  if (Object.keys(obj).length !== output.length) {
    throw new Error('duplicate key');
  }
  return obj;
}

test('basic', async () => {
  const dir = await testdir({
    '.gitignore': 'dist',
    'something/dist/other.js': '',
    'something/something.js': '',
    'a/b/c.md': '',
    'b.js': '',
    'a.js': '',
  });
  expect(short(await readToDirEntries(dir))).toMatchInlineSnapshot(`
    {
      ".gitignore": "blob",
      "a": "tree",
      "a.js": "blob",
      "a/b": "tree",
      "a/b/c.md": "blob",
      "b.js": "blob",
      "something": "tree",
      "something/something.js": "blob",
    }
  `);
});

test('with a negation', async () => {
  const dir = await testdir({
    '.gitignore': 'dist',
    'something/.gitignore': '!dist',
    'something/dist/other.js': '',
    'something/something.js': '',
    'a/b/c.md': '',
    'b.js': '',
    'a.js': '',
  });
  expect(short(await readToDirEntries(dir))).toMatchInlineSnapshot(`
    {
      ".gitignore": "blob",
      "a": "tree",
      "a.js": "blob",
      "a/b": "tree",
      "a/b/c.md": "blob",
      "b.js": "blob",
      "something": "tree",
      "something/.gitignore": "blob",
      "something/something.js": "blob",
    }
  `);
});

test('symlinks are ignored', async () => {
  const dir = await testdir({
    other: { kind: 'symlink', path: 'something/other' },
    'something/other.js': '',
  });
  expect(short(await readToDirEntries(dir))).toMatchInlineSnapshot(`
    {
      "something": "tree",
      "something/other.js": "blob",
    }
  `);
});

test('.git is ignored', async () => {
  const dir = await testdir({
    '.git/something': '',
    another: '',
  });
  expect(short(await readToDirEntries(dir))).toMatchInlineSnapshot(`
    {
      "another": "blob",
    }
  `);
});
