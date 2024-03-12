import Link from 'next/link';
import Button from './button';
import { CopyCommandButton } from './copy-command-button';
import { H1_ID } from '../constants';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-0 top-0 z-0 h-full w-full pb-24">
        <div className="relative h-full w-full overflow-hidden bg-sand-2">
          <div className="absolute left-0 top-0 h-full w-full bg-pattern-texture opacity-80 mix-blend-overlay" />
          <svg
            className="min-h-full min-w-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1440 1024"
          >
            <g clipPath="url(#hero-img-a)">
              <path
                stroke="url(#hero-img-b)"
                strokeWidth="426"
                d="M977-150 205 622v413"
              />
              <path
                stroke="url(#hero-img-c)"
                strokeWidth="426"
                d="M1580-153 631 796v239"
              />
              <path
                stroke="url(#hero-img-d)"
                strokeWidth="426"
                d="m869 256 464 464v315"
              />
              <path
                stroke="url(#hero-img-e)"
                strokeLinejoin="round"
                strokeWidth="426"
                d="m721 707 747-747"
                opacity=".4"
              />
            </g>
            <defs>
              <linearGradient
                id="hero-img-b"
                x1="565"
                x2="205"
                y1="197.8"
                y2="624.4"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E4DEFC" />
                <stop offset="1" stopColor="#FDD8D3" />
              </linearGradient>
              <linearGradient
                id="hero-img-c"
                x1="911"
                x2="631"
                y1="537.8"
                y2="804.4"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFE0A1" />
                <stop offset="1" stopColor="#CEEBCF" />
              </linearGradient>
              <linearGradient
                id="hero-img-d"
                x1="920.1"
                x2="1333.4"
                y1="306.7"
                y2="728.9"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E4DEFC" />
                <stop offset="1" stopColor="#C4EAEF" />
              </linearGradient>
              <linearGradient
                id="hero-img-e"
                x1="1001.4"
                x2="721.4"
                y1="448.9"
                y2="715.6"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFE0A1" />
                <stop offset="1" stopColor="#CEEBCF" />
              </linearGradient>
              <clipPath id="hero-img-a">
                <path fill="#fff" d="M0 0h1440v1024H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative mx-auto mb-16 mt-24 grid max-w-5xl grid-cols-8 gap-6 px-6 pt-10 md:grid-cols-12">
        <div className="col-span-8 flex flex-col items-center gap-10 text-center sm:col-span-6 sm:col-start-2 md:col-span-8 md:col-start-3">
          <div>
            <h1
              className="mb-6 text-4xl font-medium md:text-5xl"
              id={H1_ID}
              aria-label="Content management for your code base"
            >
              Content Management for your Codebase
            </h1>
            <p className="text-base md:text-lg">
              A tool that makes Markdown, JSON and YAML content in your codebase
              editable by humans. Live edit content on GitHub or your local file
              system, without disrupting your existing code and workflows.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button className="" href="/docs">
              Read the docs
            </Button>

            <CopyCommandButton />
          </div>
          <div className="inline-flex items-center gap-2 text-left">
            <svg
              className="h-6 w-6 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path
                fill="#ED0000"
                fillRule="evenodd"
                d="M16 32a16 16 0 1 0 0-32 16 16 0 0 0 0 32Z"
                clipRule="evenodd"
              />
              <path
                fill="#fff"
                d="M8.4 10.75h1.59v1.96h1.68v1.28H9.99v4.5c0 .3.05.54.14.7.09.15.2.25.35.31a1.86 1.86 0 0 0 .82.05l.23-.04.29 1.32c-.1.03-.23.07-.4.1a3.13 3.13 0 0 1-1.8-.16c-.37-.15-.66-.4-.89-.72a2.13 2.13 0 0 1-.33-1.23v-4.83H7.2V12.7h1.2v-1.96ZM13.68 12.71v8.18h1.6v-5.04a2 2 0 0 1 .22-.98c.16-.28.36-.5.61-.65.26-.16.54-.24.84-.24.44 0 .8.13 1.08.4s.42.63.42 1.07v5.44h1.58v-5.21c0-.5.15-.9.44-1.22.28-.32.69-.48 1.2-.48.42 0 .78.12 1.09.37.3.25.45.65.45 1.2v5.34h1.6v-5.48c0-.94-.24-1.64-.72-2.1a2.47 2.47 0 0 0-1.81-.7c-.6 0-1.1.13-1.53.39-.42.26-.73.6-.93 1.04h-.08c-.18-.45-.46-.8-.83-1.05a2.36 2.36 0 0 0-1.37-.39c-.54 0-1 .13-1.4.39-.38.25-.66.6-.83 1.05h-.1v-1.33h-1.53Z"
              />
            </svg>
            <span className="text-sm font-medium">
              Keystatic is a{' '}
              <Link
                href="https://thinkmill.com.au"
                className="underline hover:text-slate-11"
              >
                Thinkmill
              </Link>{' '}
              project
            </span>
          </div>
        </div>
      </div>
      <div className="relative max-w-5xl px-6 md:mx-auto">
        <div className="relative h-[75vh] max-h-[36rem] min-h-[28rem] sm:max-h-[42rem] md:aspect-[16/7] md:h-auto md:max-h-none md:min-h-0">
          <div className="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
            <div className="col-span-6 col-start-2 min-w-[40rem] overflow-hidden rounded-lg border border-sand-6 bg-sand-1 sm:col-start-3 sm:min-w-[48rem] md:col-span-8 md:mb-12 md:min-w-0">
              <img
                src="https://thinkmill-labs.keystatic.net/keystatic-site/images/fibyg87jdi7p/hero-markdoc-file"
                alt="Content edited in a markdoc file, in a code editor"
                width={884}
                height={619}
                className="w-full"
              />
            </div>
          </div>
          <div className="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
            <div className="col-span-6 col-start-1 mt-52 min-w-[40rem] overflow-hidden rounded-lg border border-sand-6 bg-sand-1 sm:col-start-2 sm:min-w-[48rem] md:col-span-8 md:col-start-5 md:mt-12 md:min-w-0">
              <img
                src="https://thinkmill-labs.keystatic.net/keystatic-site/images/b1q36g2ftnju/hero-keystatic-editor"
                alt="Content edited in a WYSIWIG editor in Keystatic Admin UI"
                width={784}
                height={549}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
