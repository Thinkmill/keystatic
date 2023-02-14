import { TextDecoder, TextEncoder } from 'util';
import { webcrypto } from 'crypto';

// not sure why these aren't in jest's jsdom environment?
globalThis.TextDecoder = TextDecoder as any;
globalThis.TextEncoder = TextEncoder;
globalThis.crypto = webcrypto as any;
