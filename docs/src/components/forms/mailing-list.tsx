import { useState } from 'react';
import Button from '../button';

export default function MailingListForm() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form
      className="flex flex-col gap-4"
      method="POST"
      action="https://forms.keystatic.cloud/mailing-list"
      onSubmit={() => {
        setIsLoading(true);
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
      <Button
        className="self-start"
        type="submit"
        impact="light"
        variant="small"
        isLoading={isLoading}
      >
        Send me updates
      </Button>
    </form>
  );
}
