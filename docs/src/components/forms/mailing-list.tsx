import { useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

import { subscribeToButtondown } from '../../app/actions';

import Button from '../button';

export default function MailingListForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const pathname = usePathname();

  // Augment the server action with the pathname
  const subscribeToButtondownWithPathname = subscribeToButtondown.bind(
    null,
    pathname
  );

  async function submitAction(formData: FormData) {
    startTransition(async () => {
      const response = await subscribeToButtondownWithPathname(formData);
      if (response.error) setError(response.error);
    });
  }
  return (
    <>
      <form className="flex flex-col gap-4" action={submitAction}>
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
          isLoading={isPending}
          disabled={isPending}
        >
          Send me updates
        </Button>
      </form>
      {error && <p className="text-xs text-thinkmill-red">{error}</p>}
    </>
  );
}
