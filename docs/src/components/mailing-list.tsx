'use client';

import MailingListForm from './forms/mailing-list';

export default function MailingList() {
  return (
    <section id="mailing-list" className="grid bg-sand-1">
      <div className="justify-self-end px-6 py-16 sm:max-w-lg sm:pr-3">
        <div className="flex flex-col gap-6 px-8 lg:px-16">
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-medium">Get Keystatic updates</h4>
            <p className="text-sm text-sand-12">
              Be the first to get updates as we work on and ship new features,
              as well as early invites to a community space we're setting up
              soon.
            </p>
          </div>
          <MailingListForm />
        </div>
      </div>
    </section>
  );
}
