import { redirect } from 'next/navigation';
import { cookies, draftMode } from 'next/headers';

export function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return new Response('Invalid origin', { status: 400 });
  }
  const referrer = req.headers.get('Referrer');
  if (!referrer) {
    return new Response('Missing referrer', { status: 400 });
  }
  draftMode().disable();
  cookies().delete('ks-branch');
  redirect(referrer);
}
