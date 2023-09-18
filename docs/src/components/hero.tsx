import Link from 'next/link';
import Button from './button';
import { CopyCommandButton } from './copy-command-button';
import { H1_ID } from '../constants';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-0 top-0 z-0 h-full w-full pb-24">
        <div className="h-full w-full overflow-hidden">
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
        </div>
      </div>
      <div className="relative mx-auto mb-16 mt-24 grid max-w-5xl grid-cols-12 gap-6 px-6 pt-10">
        <div className="col-span-12 flex flex-col items-center gap-10 text-center">
          <div>
            <h1
              className="mb-6 text-4xl font-medium md:text-5xl"
              id={H1_ID}
              aria-label="Content management for your code base"
            >
              Content Management
              <br />
              for your Codebase
            </h1>
            <p className="text-lg">
              A new tool that makes Markdown, JSON and YAML content in your
              codebase editable by humans. Live edit content on GitHub or your
              local file system, without disrupting your existing code and
              workflows.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
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
      </div>
      <div className="relative max-w-5xl px-6 md:mx-auto">
        <div className="relative h-[75vh] max-h-[36rem] min-h-[28rem] sm:max-h-[42rem] md:aspect-[16/7] md:h-auto md:max-h-none md:min-h-0">
          <div className="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
            <div className="col-span-6 col-start-2 min-w-[40rem] overflow-hidden rounded-lg border border-whiteAlpha-2 sm:col-start-3 sm:min-w-[48rem] md:col-span-8 md:mb-12 md:min-w-0">
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
            <div className="col-span-6 col-start-1 mt-52 min-w-[40rem] overflow-hidden rounded-lg border border-sand-6 sm:col-start-2 sm:min-w-[48rem] md:col-span-8 md:col-start-5 md:mt-12 md:min-w-0">
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
