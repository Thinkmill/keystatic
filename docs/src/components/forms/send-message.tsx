import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

import Button from '../button';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { SEND_MESSAGE_TABLE_ID } from './table-id';

export default function SendMessageForm() {
  const { sendForm, isLoading } = useFormSubmission();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    sendForm({
      tableId: SEND_MESSAGE_TABLE_ID,
      form,
    });
  }

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="send-message" />
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-medium" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-3 w-full rounded-lg border border-black p-3 leading-none"
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
            className="mt-3 w-full rounded-lg border border-black p-3 leading-none"
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="block font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={8}
          className="mt-3 w-full rounded-lg border border-black p-3 leading-none"
        />
      </div>

      <hr className="mt-10 border-dashed border-t-black" />

      <p className="mt-10">
        We’re building Keystatic in the open over the coming weeks and months.
        If you’re interested in following along, there’s a few ways you do
        that... No spam, just sharing the adventure!
      </p>

      <div className="mt-8 flex items-center gap-3">
        <input
          type="checkbox"
          className="h-6 w-6 rounded-md border-2 border-black text-yellow-500"
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
          className="h-6 w-6 rounded-md border-2 border-black text-yellow-500"
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
