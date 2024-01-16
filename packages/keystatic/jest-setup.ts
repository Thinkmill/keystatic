import '@testing-library/jest-dom/jest-globals';

import { TextDecoder, TextEncoder } from 'util';

// not sure why these aren't in jest's jsdom environment?
globalThis.TextDecoder = TextDecoder as any;
globalThis.TextEncoder = TextEncoder;

// remove these when Symbol.dispose/asyncDispose is in Node versions that we're using
if (typeof Symbol.dispose !== 'symbol') {
  Object.defineProperty(Symbol, 'dispose', {
    // @ts-ignore
    __proto__: null,
    configurable: false,
    enumerable: false,
    value: Symbol('dispose'),
    writable: false,
  });
}

if (typeof Symbol.asyncDispose !== 'symbol') {
  Object.defineProperty(Symbol, 'asyncDispose', {
    // @ts-ignore
    __proto__: null,
    configurable: false,
    enumerable: false,
    value: Symbol('asyncDispose'),
    writable: false,
  });
}
