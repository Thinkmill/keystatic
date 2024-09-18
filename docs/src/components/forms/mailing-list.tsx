import Button from '../button';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function MailingListForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <form
        id="mailing-list-form"
        className="flex flex-col gap-4"
        action="/mailing-list"
        method="POST"
        onSubmit={() => {
          setIsSubmitting(true);
        }}
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
              value="list:keystatic"
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
              value="list:thinkmill"
            />
            <label
              className="text-sm text-sand-11"
              htmlFor="mailing-list-thinkmill"
            >
              Thinkmill news (
              <a
                href="https://www.thinkmill.com.au/newsletter/tailwind-for-designers-multi-brand-design-systems-and-a-search-tool-for-public-domain-content"
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
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Send me updates
        </Button>
      </form>
      <Suspense fallback={null}>
        <ErrorMessage />
      </Suspense>
    </>
  );
}

function ErrorMessage() {
  const params = useSearchParams();
  const error = params.get('error');
  if (!error) return null;
  return <p className="text-xs text-thinkmill-red">{error}</p>;
}
