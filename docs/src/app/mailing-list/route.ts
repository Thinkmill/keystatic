import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return new Response('Invalid origin', { status: 400 });
  }
  if (req.headers.get('content-type') !== 'application/x-www-form-urlencoded') {
    return new Response('Invalid content type', { status: 415 });
  }

  try {
    const referer = (await headers()).get('referer');
    let pathname = '/';
    if (referer) {
      try {
        pathname = new URL(referer).pathname;
      } catch {}
    }
    const formData = await req.formData();
    console.log(formData.getAll('tags'));
    const data = {
      email: formData.get('email'),
      tags: [
        ...formData.getAll('tags'),
        `source:keystatic.com${pathname}`.substring(0, 80),
      ],
    };

    const buttondownResponse = await fetch(
      'https://api.buttondown.email/v1/subscribers',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: data.email,
          tags: data.tags,
        }),
      }
    );

    if (!buttondownResponse.ok) {
      const error = await buttondownResponse.json();
      return Response.redirect(
        new URL(
          `/?${new URLSearchParams({
            error:
              error?.detail ||
              'Sorry, an error has occurred — please try again later.',
          })}#mailing-list-form`,
          req.url
        )
      );
    }
    buttondownResponse.body?.cancel();
  } catch (error) {
    console.error('An error occurred: ', error);
    redirect(
      `/?${new URLSearchParams({
        error: 'Sorry, an error has occurred — please try again later.',
      })}#mailing-list-form`
    );
  }
  redirect('/thank-you');
}
