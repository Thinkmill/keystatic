import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';

// not sure why these aren't in jest's jsdom environment?
globalThis.TextDecoder = TextDecoder as any;
globalThis.TextEncoder = TextEncoder;
