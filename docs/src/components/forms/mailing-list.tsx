import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '../button';

export default function MailingListForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);

      const data = {
        email: formData.get('email'),
        tags: [
          ...formData.getAll('tags'),
          `keystatic website${
            window.location.pathname !== '/'
              ? `: ${window.location.pathname}`
              : ' homepage'
          }`,
        ],
      };

      // Buttondown subscription
      const buttondownResponse = await fetch(
        'https://api.buttondown.email/v1/subscribers',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_BUTTONDOWN_API_KEY}`,
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
        setError(
          error?.detail ||
            // 409 status Confilct has no detail message
            'Sorry, an error has occured — please try again later.'
        );
        setIsLoading(false);
      }

      // Success
      router.push('/thank-you');
    } catch (error) {
      console.error('An error occured: ', error);
      setError('Sorry, an error has occured — please try again later.');
      setIsLoading(false);
    }
  }
  return (
    <>
      <form
        className="flex flex-col gap-4"
        method="POST"
        action="https://forms.keystatic.cloud/mailing-list"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1">
          <label
            className="block text-sm font-medium text-sand-11"
            htmlFor="mailing-list-email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="mailing-list-email"
            required
            className="form-input h-8 w-full rounded-md border border-sand-6 bg-sand-1 px-3 py-0 text-sm leading-none hover:border-sand-8"
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="tags"
              id="mailing-list-keystatic"
              className="form-checkbox size-4 rounded text-black"
              value="keystatic_list"
              defaultChecked
            />
            <label
              className="text-sm text-sand-11"
              htmlFor="mailing-list-keystatic"
            >
              Keystatic news
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="tags"
              id="mailing-list-thinkmill"
              className="form-checkbox size-4 rounded text-black"
              value="thinkmill_list"
            />
            <label
              className="text-sm text-sand-11"
              htmlFor="mailing-list-thinkmill"
            >
              Thinkmill news (
              <a
                href="https://www.thinkmill.com.au/newsletter"
                target="_blank"
                className="cursor-pointer underline hover:text-thinkmill-red"
                aria-label="Thinkmill (Opens in new tab)"
              >
                example
              </a>
              )
            </label>
          </div>
        </div>
        <Button
          className="self-start"
          type="submit"
          impact="light"
          variant="small"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Send me updates
        </Button>
      </form>
      {error && <p className="text-xs text-thinkmill-red">{error}</p>}
    </>
  );
}
