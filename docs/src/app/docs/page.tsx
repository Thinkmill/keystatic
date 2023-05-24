import Button from '../../components/button';

export default function Docs() {
  return (
    <>
      <h1 className="text-3xl font-bold sm:text-4xl">Keystatic Docs</h1>

      <p className="mt-6 text-lg text-neutral-600">
        Keystatic is a new project from
        [Thinkmill](https://www.thinkmill.com.au) which opens up your code-based
        content (written in Markdown, JSON or YAML) to contributors who would
        prefer to write and manage content and data in a UI that looks more like
        a CMS than VS Code.
      </p>

      {/** WIP notice? */}
      <div className="relative rounded-lg p-5 bg-keystatic-gray-light w-full mt-6">
        <blockquote className="text-neutral-600">
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
              <p className="mt-4 text-keystatic-gray-dark">
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
              <p className="mt-4 text-keystatic-gray-dark">
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
