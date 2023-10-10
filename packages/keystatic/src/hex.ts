export function bytesToHex(bytes: Uint8Array): string {
  let str = '';
  for (const byte of bytes) {
    str += byte.toString(16).padStart(2, '0');
  }
  return str;
}
