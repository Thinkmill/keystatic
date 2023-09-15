import Link from 'next/link';
import Button from './button';
import { CopyCommandButton } from './copy-command-button';
import { H1_ID } from '../constants';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand-2 pt-24">
      <svg
        className="absolute left-0 top-0 z-0 min-h-full min-w-full"
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
            stroke-linejoin="round"
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
            <stop stopColor="#EDE9FE" />
            <stop offset="1" stopColor="#FFE5E5" />
          </linearGradient>
          <linearGradient
            id="hero-img-c"
            x1="911"
            x2="631"
            y1="537.8"
            y2="804.4"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFECBC" />
            <stop offset="1" stopColor="#DDF3E4" />
          </linearGradient>
          <linearGradient
            id="hero-img-d"
            x1="920.1"
            x2="1333.4"
            y1="306.7"
            y2="728.9"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EDE9FE" />
            <stop offset="1" stopColor="#D8F3F6" />
          </linearGradient>
          <linearGradient
            id="hero-img-e"
            x1="1001.4"
            x2="721.4"
            y1="448.9"
            y2="715.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFECBC" />
            <stop offset="1" stopColor="#DDF3E4" />
          </linearGradient>
          <clipPath id="hero-img-a">
            <path fill="#fff" d="M0 0h1440v1024H0z" />
          </clipPath>
        </defs>
      </svg>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pt-10  md:gap-16 md:pb-10 lg:py-16">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <h1
            className="text-4xl font-medium md:text-5xl"
            id={H1_ID}
            aria-label="Content management for your code base"
          >
            Content Management
            <br />
            for your Codebase
          </h1>

          <p className="mt-6 text-lg">
            A new tool that makes Markdown, JSON and YAML content in your
            codebase editable by humans. Live edit content on GitHub or your
            local file system, without disrupting your existing code and
            workflows.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button className="" href="/docs">
              Read the docs
            </Button>

            <CopyCommandButton />
          </div>

          <div className="mt-10 inline-flex items-center gap-2 text-left">
            <svg
              className="h-6 w-6 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#ED0000"
                fillRule="evenodd"
                d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
                clipRule="evenodd"
              />
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M8.22 13.514c0 .58.194.813.702.813.132 0 .274-.02.356-.05v.904c-.173.051-.437.092-.65.092-1.088 0-1.566-.458-1.566-1.586v-2.755h-.864v-.884h.864v-1.29H8.22v1.29h1.006v.884H8.22v2.582Zm6.16-2.653c.377-.59.875-.935 1.658-.935 1.097 0 1.768.712 1.768 2.104v3.182h-1.159v-3.07c0-.915-.355-1.28-.935-1.28-.68 0-1.087.579-1.087 1.565v2.785h-1.16V12.02c0-.732-.324-1.159-.924-1.159-.691 0-1.088.59-1.088 1.586v2.765h-1.159v-5.164h1.108v.62h.02c.367-.498.824-.742 1.434-.742.712 0 1.26.325 1.525.935Z"
                clipRule="evenodd"
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

        <div className="relative h-[100vw] w-full md:h-[22vw] lg:h-[25vw] xl:h-[20rem]">
          <img
            src="https://keystatic.io/images/keystatic-docs/hero-markdoc.png"
            alt="Content edited in a markdoc file, in a code editor"
            width={784}
            height={549}
            className="absolute -right-[40%] -top-[5%] w-[110vw] max-w-none md:-left-[5%] md:-top-[2.5rem] md:w-2/3 md:max-w-full"
          />
          <img
            src="https://keystatic.io/images/keystatic-docs/hero-editor-current.png"
            alt="Content edited in a WYSIWIG editor in Keystatic Admin UI"
            width={784}
            height={549}
            className="absolute -bottom-[5%] -right-[25%] w-[110vw] max-w-none md:-right-[5%] md:top-0 md:w-2/3 md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
