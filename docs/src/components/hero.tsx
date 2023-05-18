import Link from 'next/link';
import Button from './button';

// const features = [
//   'First-class CMS experience',
//   'Visually edit Markdoc & components',
//   'TypeScript API, no database',
//   'Integrates with Astro, Remix and Next.js',
// ];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl py-12 px-6 md:py-16 flex flex-col items-center gap-10">
        <div className="text-center max-w-xl flex flex-col items-center gap-8">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
            Content Management for your{' '}
            <span className="relative">
              <svg
                className="absolute -right-3 -bottom-1.5 w-[110%]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 392 92"
              >
                <path
                  fill="#F7DE5B"
                  d="m4.239.201 92.684 2.883 100.722 7.097 99.043 7.211 94.363 2.77-21.813 9.088 14.042 9.919 2.873 8.7-14.795 6.043 7.844 5.477 7.843 5.476-14.691 6.037 11.104 9.535 3.927 10.77-93.59-1.7-100.082-5.647-116.75-3.055-76.39-9.559 12.857-8.312-11.94-9.45 5.534-10.258-4.618-7.502 16.812-1.055L7.21 20.478l5.332-11.703L4.239.201Z"
                />
              </svg>
              <span className="relative">Codebase</span>
            </span>
          </h1>

          <p className="text-lg font-semibold">
            A new tool that makes Markdown, JSON and YAML content in your
            codebase editable by humans.
          </p>

          <Button className="w-80">Read the docs</Button>

          <div className="inline-flex items-center gap-2">
            <svg
              className="h-6 w-6 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <span className="font-medium">
              Keystatic is another{' '}
              <Link
                href="https://thinkmill.com.au"
                className="underline hover:text-keystatic-gray-dark"
              >
                Thinkmill
              </Link>{' '}
              project
            </span>
          </div>
        </div>

        <p className="text-sm text-stone-600 text-center">
          Live edit content on GitHub or your local file system, without
          disrupting your existing code and workflows.
        </p>

        <div className="relative w-full h-[21rem]">
          <img
            src="/images/hero-mdoc.png"
            alt="Content edited in a markdoc file, in a code editor"
            className="absolute lg:w-[54rem] -left-[4rem] "
          />
          <img
            src="/images/hero-editor.png"
            alt="Content edited in a WYSIWIG editor in Keystatic Admin UI"
            className="absolute lg:w-[54rem] -right-[4rem] -top-[2.5rem]"
          />
        </div>
      </div>
    </section>
  );
}
