/** @jest-environment node */
import { expect, test } from '@jest/globals';
import { sha1 as sha1Node } from './node';
import { sha1 as sha1Webcrypto } from './webcrypto';
import { webcrypto } from 'crypto';

// globalThis.crypto is only set in newer node versions
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

const textEncoder = new TextEncoder();

const input = textEncoder.encode('aasdfasdfasdfasdfasdf');
const expected = '9197bfff72ce789d81b6af2c065cfc200c6f1085';

test('webcrypto', async () => {
  expect(await sha1Webcrypto(input)).toEqual(expected);
});

test('node', async () => {
  expect(await sha1Node(input)).toEqual(expected);
});
