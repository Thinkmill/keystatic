'use client';

import { GithubIcon } from './icons/github-icon';

export default function CallToAction() {
  const linkLabels = {
    tmLabs: 'Thinkmill Labs',
    ksDiscussions: 'Join the discussion on GitHub',
  };

  return (
    <section className="relative grid overflow-hidden bg-sand-2">
      {/* Background svg */}
      <svg
        className="absolute left-0 top-0 z-0 min-h-full opacity-80"
        width="756"
        height="637"
        viewBox="0 0 756 637"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1540_2892)">
          <path
            d="M-80 -360L997 717"
            stroke="url(#paint0_linear_1540_2892)"
            strokeWidth="226"
            strokeLinejoin="round"
          />
          <path
            d="M-91.9999 -54.0001L181 219L499 219L997 717"
            stroke="url(#paint1_linear_1540_2892)"
            strokeWidth="226"
          />
          <path
            opacity="0.4"
            d="M-80 -360L997 717.001"
            stroke="url(#paint2_linear_1540_2892)"
            strokeWidth="224"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_1540_2892"
            x1="-1.04043e+11"
            y1="1.04043e+11"
            x2="-1.04043e+11"
            y2="1.04043e+11"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1540_2892"
            x1="167.812"
            y1="205.973"
            x2="636.388"
            y2="674.549"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF8BB" />
            <stop offset="1" stopColor="#D7CFF9" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1540_2892"
            x1="189.917"
            y1="-89.7194"
            x2="538.438"
            y2="258.801"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
          <clipPath id="clip0_1540_2892">
            <rect width="756" height="637" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute left-0 top-0 h-full w-full bg-pattern-texture opacity-80 mix-blend-overlay" />
      <div className="relative px-6 py-16 sm:max-w-lg sm:pl-3">
        <div className="flex flex-col gap-6 px-8 lg:px-16">
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-medium">Tell us what you think</h4>
            <p className="text-sm text-sand-12">
              We're building Keystatic in the open as part of{' '}
              <a
                href="https://www.thinkmill.com.au/"
                target="_blank"
                className="cursor-pointer underline hover:text-thinkmill-red"
                aria-label={`${linkLabels.tmLabs} (Opens in new tab)`}
              >
                {linkLabels.tmLabs}
              </a>{' '}
              Research &amp; Development.
            </p>

            <p className="text-sm text-sand-12">
              Feedback on how we're going, what you're looking for, and what
              you'd like to see next is super helpful as we progress!
            </p>
          </div>
          <ul className="flex list-none flex-col gap-1">
            <li>
              <a
                href="https://github.com/Thinkmill/keystatic/discussions"
                target="_blank"
                aria-label={`${linkLabels.ksDiscussions} (Opens in new tab)`}
              >
                <span className="flex h-8 flex-row items-center gap-4 text-sm font-medium text-sand-12 transition-all duration-150 hover:gap-6 hover:text-black">
                  <GithubIcon />
                  <span>{linkLabels.ksDiscussions}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
