import { useFormSubmission } from '../../hooks/useFormSubmission';

import Button from '../button';

import { MAILING_LIST_TABLE_ID } from './table-id';

export default function MailingListForm() {
  const { sendForm, isLoading } = useFormSubmission();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    sendForm({
      tableId: MAILING_LIST_TABLE_ID,
      form,
    });
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="mailing-list" />
      <div className="flex flex-col gap-1">
        <label
          className="block text-sm font-medium text-sand-11"
          htmlFor="mailing-list-email"
        >
          Email
        </label>
        <input
          type="email"
          name="mailing-list-email"
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
