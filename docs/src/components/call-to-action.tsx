'use client';

import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import Dialog from './dialog';
import Button from './button';
import SendMessageForm from './forms/send-message';

export default function CallToAction() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="bg-keystatic-gray-light">
      <div className="relative mx-auto max-w-5xl">
        <svg
          className="absolute right-8 top-0 w-10 -translate-y-1/2 md:w-12"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 54 124"
        >
          <path
            fill="#000"
            d="M13.169 122.883c9.665-2.25 26.865-6.787 27.626-7.274.457-.3 1.218-1.313 1.674-2.25.837-1.687.837-1.837.267-3.037-1.37-2.812-4.68-3.15-12.748-1.275-2.968.675-5.518 1.125-5.67.975-.342-.3.19-1.237 4.87-8.324 12.33-18.823 19.674-35.359 22.947-51.82 1.484-7.311 1.826-10.648 1.864-16.948.038-9.599-1.598-17.323-5.06-23.96-3.35-6.411-3.768-6.899-6.66-8.061-1.408-.563-2.626-.975-2.664-.9-.038.075.495 2.062 1.18 4.424 5.67 19.16 5.708 32.434.114 51.482C38.131 65.44 32.538 78 26.221 88.95c-4.072 7.012-13.585 20.323-15.26 21.373-.19.112-.456-1.05-.608-2.7-.457-5.137-1.37-12.936-1.789-15.073-.951-5.025-1.94-6.6-5.137-8.212l-1.598-.75-.19 1.013c-.38 1.612-.99 12.148-1.408 23.397-.343 9.524-.343 10.574.266 12.374 1.37 3.937 4.11 4.499 12.672 2.512Z"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-3xl py-12 px-6 text-center md:py-24">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 33 36"
          className="mx-auto w-8"
        >
          <path
            fill="#000"
            fillRule="evenodd"
            d="M25.475.757a6.285 6.285 0 0 1 2.467.541c.075.445.321.774.737.985a1.28 1.28 0 0 1-.063.853 14.575 14.575 0 0 1-1.574 3.315 71.235 71.235 0 0 0-6.378 10.395 187.49 187.49 0 0 0 9.084-1.183c1.38.191 2.133.962 2.26 2.313-.114.754-.542 1.222-1.284 1.406-3.459.5-6.93.91-10.414 1.227a.653.653 0 0 0-.309.192 96.066 96.066 0 0 0 9.804 8.953c.596.672 1.96.969 1.768 1.99-.102.545-.602.733-.823 1.155-1.339.398-2.601.185-3.786-.64a176.583 176.583 0 0 1-10.065-9.401 76.27 76.27 0 0 0-2.277 3.835 60.483 60.483 0 0 1-4.93 8.786c-.472.306-.996.41-1.572.312-.678-.163-1.35-.38-2.016-.65-.5-.474-.63-1.032-.392-1.675a37.317 37.317 0 0 0 5.235-8.906 35.987 35.987 0 0 1 1.935-3.217c-3.189.415-6.39.82-9.602 1.216a5.314 5.314 0 0 1-2.69-1.488c-.314-.759-.144-1.39.509-1.892 2.927-.417 5.857-.819 8.79-1.205a46.712 46.712 0 0 0 2.551-.597c-2.41-3.5-4.933-6.93-7.566-10.288-1.018-1.498-.631-2.398 1.16-2.702.746-.063 1.42.13 2.022.58 2.631 3.718 5.28 7.419 7.947 11.103a426.154 426.154 0 0 1 6.713-10.942 18.337 18.337 0 0 0 1.753-3.73c.324-.254.66-.467 1.006-.641Z"
            clipRule="evenodd"
            opacity=".953"
          />
        </svg>
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
          Tell us what{' '}
          <span className="relative">
            <svg
              className="absolute -right-1 bottom-0 w-[115%]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 109 62"
            >
              <path
                fill="#F7DE5B"
                d="M9.604.574 58.04 9.223l50.175 10.032-6.471 5.015.588 5.884.686 5.467-8.348 2.547 3.604 3.891 3.603 3.892-5.51 3.993 2.15 5.143 1.045 6.796-58.921-8.911L.95 43.202l5.24-4.823-3.076-5.834 3.88-5.782-1.717-4.875 8.936.616-4.968-9.464 3.91-6.67L9.604.574Z"
              />
            </svg>
            <span className="relative">you</span>
          </span>{' '}
          think
        </h2>
        <p className="mt-6 text-lg text-keystatic-gray-dark">
          We're building Keystatic in the open as part of{' '}
          <a
            href="https://www.thinkmill.com.au/"
            target="_blank"
            className="cursor-pointer underline hover:text-thinkmill-red"
          >
            Thinkmill Labs
          </a>{' '}
          Research &amp; Development. Feedback on{' '}
          <span className="font-semibold">
            how we're going, what you're looking for, and what you'd like to see
            next
          </span>{' '}
          is super helpful as we progress!
        </p>
        <div className="mx-auto mt-10 flex max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Button
            href="https://github.com/Thinkmill/keystatic/discussions"
            target="_blank"
            className="flex items-center gap-2.5"
          >
            <span>Join the discussion on GitHub</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
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
            <p className="mt-4 text-keystatic-gray-dark">
              Tell us what you think below.
            </p>
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
