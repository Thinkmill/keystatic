import { base64UrlDecode, base64UrlEncode } from '#base64';
import { webcrypto } from '#webcrypto';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(secret: string, salt: Uint8Array) {
  if (secret.length < 32) {
    throw new Error('KEYSTATIC_SECRET must be at least 32 characters long');
  }
  const encoded = encoder.encode(secret);
  const key = await webcrypto.subtle.importKey('raw', encoded, 'HKDF', false, [
    'deriveKey',
  ]);
  return webcrypto.subtle.deriveKey(
    { name: 'HKDF', salt, hash: 'SHA-256', info: new Uint8Array(0) },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function encryptValue(value: string, secret: string) {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);
  const encoded = encoder.encode(value);
  const encrypted = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  const full = new Uint8Array(SALT_LENGTH + IV_LENGTH + encrypted.byteLength);
  full.set(salt);
  full.set(iv, SALT_LENGTH);
  full.set(new Uint8Array(encrypted), SALT_LENGTH + IV_LENGTH);
  return base64UrlEncode(full);
}

export async function decryptValue(encrypted: string, secret: string) {
  const decoded = base64UrlDecode(encrypted);
  const salt = decoded.slice(0, SALT_LENGTH);
  const key = await deriveKey(secret, salt);
  const iv = decoded.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const value = decoded.slice(SALT_LENGTH + IV_LENGTH);
  const decrypted = await webcrypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    value
  );
  return decoder.decode(decrypted);
}
