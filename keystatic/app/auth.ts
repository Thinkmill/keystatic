import { parse } from 'cookie';

export async function getAuth() {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookies = parse(document.cookie);
  const accessToken = cookies['keystatic-gh-access-token'];
  if (!accessToken) {
    try {
      const res = await fetch('/api/keystatic/github/refresh-token', {
        method: 'POST',
      });
      if (res.status === 200) {
        const cookies = parse(document.cookie);
        const accessToken = cookies['keystatic-gh-access-token'];
        if (accessToken) {
          return { accessToken };
        }
      }
    } catch {}
    return null;
  }
  return { accessToken };
}
