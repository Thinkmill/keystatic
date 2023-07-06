export async function sha1(content: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', content);
  let str = '';
  for (const byte of new Uint8Array(hashBuffer)) {
    str += byte.toString(16).padStart(2, '0');
  }
  return str;
}
