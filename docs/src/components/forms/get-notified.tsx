import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

import Button from '../button';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { GET_NOTIFIED_TABLE_ID } from './table-id';
import { useSearchParams } from 'next/navigation';

export default function GetNotifiedForm() {
  const templateParam = useSearchParams()?.get('template') || '';
  const { sendForm, isLoading } = useFormSubmission();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    sendForm({
      tableId: GET_NOTIFIED_TABLE_ID,
      form,
    });
  }
  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="get-notified" />
      <input type="hidden" name="template" value={templateParam} />
      <div className="flex items-center gap-3">
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

      <hr className="mt-10 border-dashed border-t-black" />

      <div className="mt-10 grid grid-cols-2 gap-6">
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

      <Button
        className="mt-10 flex w-full items-center justify-center gap-2"
        type="submit"
        isLoading={isLoading}
      >
        <span>Get notified</span>
        <ArrowSmallRightIcon className="h-4 w-4 fill-white" />
      </Button>
    </form>
  );
}
