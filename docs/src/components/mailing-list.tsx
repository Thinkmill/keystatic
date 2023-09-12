'use client';

import MailingListForm from './forms/mailing-list';

export default function MailingList() {
  return (
    <section id="mailing-list" className="relative">
      <div className="mx-auto grid grid-cols-6 gap-6 px-6 py-12 md:pr-3">
        <div className="col-span-5">
          <div>
            <h2 className="text-3xl font-semibold">Get Keystatic updates</h2>

            <p className="mt-4 text-base">
              Be the first to get updates as we work on and ship new features,
              as well as early invites to a community space we're setting up
              soon.
            </p>
          </div>
          <div className="mt-6">
            <MailingListForm />
          </div>
        </div>
      </div>
    </section>
  );
}
