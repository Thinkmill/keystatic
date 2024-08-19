'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// ------------------------------
// Buttondown subscription
// ------------------------------
export async function subscribeToButtondown(
  _state: unknown,
  formData: FormData
) {
  try {
    const referer = headers().get('referer');
    let pathname = '/';
    if (referer) {
      try {
        pathname = new URL(referer).pathname;
      } catch {}
    }
    const data = {
      email: formData.get('email'),
      tags: [
        ...formData.getAll('tags'),
        `keystatic website${pathname !== '/' ? `: ${pathname}` : ' homepage'}`,
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
      return {
        // 409 status Conflict has no detail message
        error:
          error?.detail ||
          'Sorry, an error has occurred — please try again later.',
      };
    }
    buttondownResponse.body?.cancel();
  } catch (error) {
    console.error('An error occurred: ', error);
    return {
      error: 'Sorry, an error has occurred — please try again later.',
    };
  }
  redirect('/thank-you');
}
