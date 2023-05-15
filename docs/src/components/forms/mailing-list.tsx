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
    <form className="mx-auto max-w-sm lg:max-w-none" onSubmit={handleSubmit}>
      <input type="hidden" name="form-type" value="mailing-list" />
      <div>
        <label className="block font-medium" htmlFor="mailing-list-email">
          Email
        </label>
        <input
          type="email"
          name="mailing-list-email"
          id="mailing-list-email"
          required
          className="mt-3 w-full rounded-lg border border-black p-3 leading-none"
        />
      </div>
      <Button
        className="mt-4 w-full md:w-auto"
        type="submit"
        isLoading={isLoading}
      >
        Sign up
      </Button>
    </form>
  );
}
