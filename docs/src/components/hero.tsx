import Link from 'next/link';
import Button from './button';
import { CopyCommandButton } from './copy-command-button';
import { H1_ID } from '../constants';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pt-10 md:gap-16 md:pb-10 lg:py-16">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <h1
            className="text-3xl font-extrabold sm:text-4xl md:text-5xl"
            id={H1_ID}
            aria-label="Content management for your code base"
          >
            Content Management
            <br />
            for your Codebase
          </h1>

          <p className="text-lg font-normal">
            A new tool that makes Markdown, JSON and YAML content in your
            codebase editable by humans. Live edit content on GitHub or your
            local file system, without disrupting your existing code and
            workflows.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
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

        <div className="relative h-[100vw] w-full md:h-[22vw] lg:h-[25vw] xl:h-[20rem]">
          <img
            src="https://keystatic.io/images/keystatic-docs/hero-markdoc.png"
            alt="Content edited in a markdoc file, in a code editor"
            width={784}
            height={549}
            className="absolute -right-[40%] -top-[5%] w-[110vw] max-w-none md:-left-[5%] md:top-0 md:w-2/3 md:max-w-full"
          />
          <img
            src="https://keystatic.io/images/keystatic-docs/hero-editor-current.png"
            alt="Content edited in a WYSIWIG editor in Keystatic Admin UI"
            width={784}
            height={549}
            className="absolute -bottom-[5%] -right-[25%] w-[110vw] max-w-none md:-right-[5%] md:-top-[2.5rem] md:w-2/3 md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
