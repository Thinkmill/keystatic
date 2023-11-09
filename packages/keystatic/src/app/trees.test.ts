/** @jest-environment node */
import {
  treeEntriesToTreeNodes,
  treeSha,
  updateTreeWithChanges,
} from './trees';
import { webcrypto } from 'node:crypto';
import { expect, test } from '@jest/globals';

// node only started setting the web crypto api globally in newer versions
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

const treeCases = {
  c0a024bf32e4945701974161f663096ac2cc4ea9: `040000 tree 20908c89b720236da0ab3a9f4ded951c98fdb395	2023-is-finally-here
040000 tree 3a671bc767c7ba5c3badb3ff1719026580fbc899	kwjnsdfkjwsdfkjsadjfkn
040000 tree 22722a8e4157fee00b389d77c69dc356830fc568	something
040000 tree 85bb94ac64637bc9c3a524106d2a3b3891cee93d	test-slug
040000 tree b2603a734f9d9ed518aa39c055e70c480b21da76	test-thing
040000 tree dc2e9f3b17788dc6afa4bd44d569201291778e18	the-post-title`,
  e5e053855c47d1735d8ecb5a71b9dde3e179d193: `100644 blob 2ef267e25bd6c6a300bb473e604b092b6a48523b	c.md
100644 blob 2e65efe2a145dda7ee51d1741299f848e5bf752e	d.md`,
};

for (const [expectedSha, str] of Object.entries(treeCases)) {
  test(`treeSha(...) === ${expectedSha}`, async () => {
    let lines = str.split('\n');

    const entries = new Map(
      lines.map(line => {
        let [mode, type, sha, name] = line.split(/\s/);
        return [name, { entry: { mode, type, sha, path: '', url: '' } }];
      })
    );

    const sha = await treeSha(entries);
    expect(sha).toEqual(expectedSha);
  });
}

const input = [
  {
    path: 'README.md',
    mode: '100644',
    type: 'blob',
    sha: 'fe5b6f6dcf3759216691fe3049d4260800c14fa6',
  },
  {
    path: 'something',
    mode: '040000',
    type: 'tree',
    sha: 'fabec7091400d7ca23e3ec49f082954520144661',
  },
  {
    path: 'something/a',
    mode: '040000',
    type: 'tree',
    sha: '4ad6218f6fe74ae926ecfb79a3c94f61f3a6d884',
  },
  {
    path: 'something/a/b',
    mode: '040000',
    type: 'tree',
    sha: '6c0e9fee68c398788e2579029f837a3149b04657',
  },
  {
    path: 'something/a/b/c.md',
    mode: '100644',
    type: 'blob',
    sha: '2ef267e25bd6c6a300bb473e604b092b6a48523b',
  },
];

const expectedOutput = [
  {
    path: 'README.md',
    mode: '100644',
    type: 'blob',
    sha: 'fe5b6f6dcf3759216691fe3049d4260800c14fa6',
  },
  {
    path: 'something',
    mode: '040000',
    type: 'tree',
    sha: '8ff4c9791de595354d3f5aaf65578694ac7378a0',
  },
  {
    path: 'something/a',
    mode: '040000',
    type: 'tree',
    sha: 'ddd9e16c2bc1da4fb33704702871a470580fad4e',
  },
  {
    path: 'something/a/b',
    mode: '040000',
    type: 'tree',
    sha: 'e5e053855c47d1735d8ecb5a71b9dde3e179d193',
  },
  {
    path: 'something/a/b/c.md',
    mode: '100644',
    type: 'blob',
    sha: '2ef267e25bd6c6a300bb473e604b092b6a48523b',
  },
  {
    path: 'something/a/b/d.md',
    mode: '100644',
    type: 'blob',
    sha: '2e65efe2a145dda7ee51d1741299f848e5bf752e',
  },
];
const textEncoder = new TextEncoder();

test('updateTreeWithChanges', async () => {
  const changes = {
    additions: [
      { path: 'something/a/b/d.md', contents: textEncoder.encode('a') },
    ],
    deletions: [],
  };
  const output = await updateTreeWithChanges(
    treeEntriesToTreeNodes(input),
    changes
  );
  expect(output.entries).toEqual(expectedOutput);
});
