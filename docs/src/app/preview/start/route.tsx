import { redirect } from 'next/navigation';
import { draftMode, cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const branch = params.get('branch');
  const to = params.get('to');
  if (!branch || !to) {
    return new Response('Missing branch or to params', { status: 400 });
  }
  draftMode().enable();
  cookies().set('ks-branch', branch);
  const toUrl = new URL(to, url.origin);
  toUrl.protocol = url.protocol;
  toUrl.host = url.host;
  redirect(toUrl.toString());
}
