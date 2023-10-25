import { redirect } from 'next/navigation';
import { cookies, draftMode } from 'next/headers';

export function GET(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return new Response('Invalid origin', { status: 400 });
  }
  const referrer = req.headers.get('Referer');
  if (!referrer) {
    return new Response('Missing Referer', { status: 400 });
  }
  draftMode().disable();
  cookies().delete('ks-branch');
  redirect(referrer);
}
