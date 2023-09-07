'use client';

import { useState } from 'react';

import Dialog from './dialog';
import Button from './button';
import SendMessageForm from './forms/send-message';
import { StarIcon } from './icons/star-icon';

export default function CallToAction() {
  const [isOpen, setIsOpen] = useState(false);

  const linkLabels = {
    tmLabs: 'Thinkmill Labs',
    ksDiscussions: 'Join the discussion on GitHub',
  };

  return (
    <section className="relative bg-sand-5">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-12 text-center md:pb-24 md:pt-16">
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
          Tell us what you think
        </h2>
        <p className="mt-6">
          We're building Keystatic in the open as part of{' '}
          <a
            href="https://www.thinkmill.com.au/"
            target="_blank"
            className="cursor-pointer underline hover:text-thinkmill-red"
            aria-label={`${linkLabels.tmLabs} (Opens in new tab)`}
          >
            {linkLabels.tmLabs}
          </a>{' '}
          Research &amp; Development. Feedback on how we're going, what you're
          looking for, and what you'd like to see next is super helpful as we
          progress!
        </p>
        <div className="mx-auto mt-10 flex max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Button
            href="https://github.com/Thinkmill/keystatic/discussions"
            target="_blank"
            aria-label={`${linkLabels.ksDiscussions} (Opens in new tab)`}
          >
            {linkLabels.ksDiscussions}
          </Button>

          <Button impact="light" onClick={() => setIsOpen(true)}>
            Send us a message
          </Button>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header={() => (
          <>
            <h2 className="pr-8 text-3xl font-bold sm:text-4xl sm:leading-tight">
              Send us a message
            </h2>
            <p className="mt-4 text-slate-11">Tell us what you think below.</p>
          </>
        )}
      >
        <div className="mt-6">
          <h3 className="text-2xl font-bold leading-7">
            Tell us a bit about yourself
          </h3>
          <SendMessageForm />
        </div>
      </Dialog>
    </section>
  );
}
