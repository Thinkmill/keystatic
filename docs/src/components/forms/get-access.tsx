import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

import Button from '../button';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import type { Template } from '../templates';
import { GET_ACCESS_TABLE_ID } from './table-id';
import { useSearchParams } from 'next/navigation';

export default function GetAccessForm({ template }: { template: Template }) {
  const templateParam = useSearchParams()?.get('template') || '';
  const { sendForm, isLoading } = useFormSubmission();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    sendForm({
      tableId: GET_ACCESS_TABLE_ID,
      form,
      onSuccess: () => {
        if (!template.repo) return;
        const url = new URL('https://vercel.com/new/clone');
        url.searchParams.set('repository-name', template.repo.suggestedName);
        url.searchParams.set('project-name', template.repo.suggestedName);
        url.searchParams.set(
          'redirect-url',
          `https://keystatic.cloud/deploy/deployed`
        );
        url.searchParams.set(
          'repository-url',
          `https://github.com/${template.repo.owner}/${template.repo.name}`
        );
        url.searchParams.set(
          'integration-ids',
          process.env.NEXT_PUBLIC_VERCEL_CLIENT_ID!
        );

        window.location.href = url.toString();
      },
    });
  }
  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="get-access" />
      <input type="hidden" name="template" value={templateParam} />
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-medium" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input mt-3 w-full rounded-lg border border-black p-3 leading-none"
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input mt-3 w-full rounded-lg border border-black p-3 leading-none"
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="block font-medium" htmlFor="working-on">
          What are you working on?
        </label>
        <textarea
          id="working-on"
          name="working-on"
          rows={8}
          className="form-textarea mt-3 w-full rounded-lg border border-black p-3 leading-none"
        />
      </div>

      <hr className="mt-10 border-dashed border-t-black" />

      <p className="mt-10">
        We're building Keystatic in the open over the coming weeks and months.
        If you're interested in following along, there's a few ways you do
        that... No spam, just sharing the adventure!
      </p>

      <div className="mt-8 flex items-center gap-3">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 rounded-md border-2 border-black text-keystatic-highlight"
          id="opt-in-updates"
          name="opt-in-updates"
        />
        <label htmlFor="opt-in-updates">
          I want to receive updates about our launch
        </label>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 rounded-md border-2 border-black text-keystatic-highlight"
          id="opt-in-channel"
          name="opt-in-channel"
        />
        <label htmlFor="opt-in-channel">
          I want to receive an invite to our early access channel
        </label>
      </div>
      <Button
        className="mt-10 flex w-full items-center justify-center gap-2"
        type="submit"
        isLoading={isLoading}
      >
        <span>Continue</span>
        <ArrowSmallRightIcon className="h-4 w-4 fill-white" />
      </Button>
    </form>
  );
}
