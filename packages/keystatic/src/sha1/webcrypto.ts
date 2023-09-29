import { bytesToHex } from '../hex';

export async function sha1(content: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', content);
  return bytesToHex(new Uint8Array(hashBuffer));
}
