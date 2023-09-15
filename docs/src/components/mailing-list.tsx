'use client';

import MailingListForm from './forms/mailing-list';

export default function MailingList() {
  return (
    <section
      id="mailing-list"
      className="relative grid w-full justify-self-end bg-sand-1"
    >
      <div className="w-full max-w-lg gap-6 justify-self-end px-6 py-16 md:pr-0">
        <div className="px-16">
          <h4 className="text-xl font-medium">Get Keystatic updates</h4>
          <p className="mt-4 text-sm text-sand-11">
            Be the first to get updates as we work on and ship new features, as
            well as early invites to a community space we're setting up soon.
          </p>
          <MailingListForm />
        </div>
      </div>
    </section>
  );
}
