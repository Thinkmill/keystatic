import Button from '../../components/button';

export default function Docs() {
  return (
    <>
      <h2 className="text-3xl font-bold sm:text-4xl">
        Welcome to Keystatic{' '}
        <span className="relative">
          <svg
            className="absolute -right-2 bottom-2 w-[115%]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 392 92"
          >
            <path
              fill="#F7DE5B"
              d="m4.239.201 92.684 2.883 100.722 7.097 99.043 7.211 94.363 2.77-21.813 9.088 14.042 9.919 2.873 8.7-14.795 6.043 7.844 5.477 7.843 5.476-14.691 6.037 11.104 9.535 3.927 10.77-93.59-1.7-100.082-5.647-116.75-3.055-76.39-9.559 12.857-8.312-11.94-9.45 5.534-10.258-4.618-7.502 16.812-1.055L7.21 20.478l5.332-11.703L4.239.201Z"
            />
          </svg>
          <span className="relative">Docs</span>
        </span>
      </h2>

      <p className="mt-6 text-lg text-stone-600">
        Keystatic is a new project from
        [Thinkmill](https://www.thinkmill.com.au) which opens up your code-based
        content (written in Markdown, JSON or YAML) to contributors who would
        prefer to write and manage content and data in a UI that looks more like
        a CMS than VS Code.
      </p>

      {/** WIP notice? */}
      <div className="relative rounded-lg p-5 bg-keystatic-gray-light w-full mt-6">
        <blockquote className="text-stone-600">
          <p className="flex gap-5 items-center">
            <span className="text-3xl">🚧</span>
            <span>
              We've been working on Keystatic for a while, but we're at the very
              early stages of releasing Keystatic publicly. Much more to come…
            </span>
          </p>
        </blockquote>
      </div>

      {/** Shortcuts to key parts? */}
      <ul className="mt-8 grid items-stretch gap-8 grid-cols-1 md:grid-cols-2">
        <li>
          <div className="grid h-full grid-rows-[auto,1fr] overflow-hidden rounded-xl border border-black">
            <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
              <h2 className="text-xl font-semibold leading-tight">
                New Features & Updates
              </h2>
              <p className="mt-4 text-stone-700">
                Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum.
              </p>

              <Button
                className="mt-6 flex items-center justify-center gap-2.5"
                impact="light"
              >
                <span>Read more</span>
              </Button>
            </div>
          </div>
        </li>

        <li>
          <div className="grid h-full grid-rows-[auto,1fr] overflow-hidden rounded-xl border border-black">

            <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
              <h2 className="text-xl font-semibold leading-tight">
                New Features & Updates
              </h2>
              <p className="mt-4 text-stone-700">
                Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum.
              </p>

              <Button
                className="mt-6 flex items-center justify-center gap-2.5"
                impact="light"
              >
                <span>Read more</span>
              </Button>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
