'use client';

import MailingListForm from './forms/mailing-list';

export default function MailingList() {
  return (
    <section id="mailing-list" className="grid bg-sand-1">
      <div className="justify-self-end px-6 py-16 sm:max-w-lg sm:pr-3">
        <div className="flex flex-col gap-6 px-8 lg:px-16">
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-medium">Get updates</h4>
            <p className="text-sm text-sand-12">
              To stay connected to the latest Keystatic and{' '}
              <a
                href="https://www.thinkmill.com.au/"
                target="_blank"
                className="cursor-pointer underline hover:text-thinkmill-red"
                aria-label="Thinkmill (Opens in new tab)"
              >
                Thinkmill
              </a>{' '}
              news, signup to our newsletters:
            </p>
          </div>
          <MailingListForm />
        </div>
      </div>
    </section>
  );
}
