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
    <form className="mx-auto" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="mailing-list" />
      <div>
        <label
          className="block text-sm font-medium"
          htmlFor="mailing-list-email"
        >
          Email
        </label>
        <input
          type="email"
          name="mailing-list-email"
          id="mailing-list-email"
          required
          className="form-input mt-2 w-full rounded-lg border border-sand-6 bg-sand-1 px-4 py-3 leading-none hover:border-sand-8"
        />
      </div>
      <Button className="mt-4 w-auto" type="submit" isLoading={isLoading}>
        Send me updates
      </Button>
    </form>
  );
}
