'use client';

import MailingListForm from './forms/mailing-list';

export default function MailingList() {
  return (
    <section id="mailing-list" className="relative bg-sand-4">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-24">
        <div className="grid items-center justify-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-32">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Get Keystatic updates
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base">
              Be the first to get updates as we work on and ship new features,
              as well as early invites to a community space we're setting up
              soon.
            </p>
          </div>
          <div>
            <MailingListForm />
          </div>
        </div>
      </div>
    </section>
  );
}
