import Link from 'next/link';

const features = [
  'First-class CMS experience',
  'Visually edit Markdoc & components',
  'TypeScript API, no database',
  'Integrates with Astro, Remix and Next.js',
];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-y-8 py-12 px-6 md:gap-y-16 md:py-16 lg:grid-cols-12 lg:items-center">
        <div className="text-center lg:col-span-7 lg:pr-8 lg:text-left xl:col-span-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Content Management for your{' '}
            <span className="relative">
              <svg
                className="absolute -right-2 bottom-0 w-[105%]"
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
          <p className="mx-auto mt-8 max-w-2xl text-xl text-stone-600 md:text-2xl lg:mx-0">
            A new tool that makes Markdown, JSON and YAML content in your
            codebase editable by humans.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-stone-600 md:text-2xl lg:mx-0">
            Live edit content on GitHub or your local file system, without
            disrupting your existing code and workflows.
          </p>
          <div className="mt-12 inline-flex items-center gap-3 rounded-2xl bg-keystatic-gray px-5 py-4">
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
        <ul className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-8 text-xl leading-none lg:col-span-6 lg:col-start-8 lg:max-w-none">
          {features.map(feature => (
            <li key={feature} className="flex items-center gap-4">
              <svg
                className="w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 19"
              >
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M12.737.879c.432.007.843.097 1.234.27a.65.65 0 0 0 .369.492.64.64 0 0 1-.032.427 7.283 7.283 0 0 1-.787 1.658 35.621 35.621 0 0 0-3.189 5.197 93.757 93.757 0 0 0 4.542-.592c.69.096 1.066.482 1.13 1.157-.057.377-.271.611-.642.703-1.73.25-3.465.455-5.207.614A.327.327 0 0 0 10 10.9a48.017 48.017 0 0 0 4.902 4.477c.299.336.98.484.885.995-.051.273-.302.366-.412.578-.67.198-1.3.092-1.893-.32a88.354 88.354 0 0 1-5.033-4.701 38.147 38.147 0 0 0-1.138 1.917 30.24 30.24 0 0 1-2.465 4.393 1.063 1.063 0 0 1-.786.156 7.004 7.004 0 0 1-1.008-.325c-.25-.237-.315-.516-.196-.837a18.657 18.657 0 0 0 2.617-4.453c.295-.553.617-1.089.968-1.608-1.594.207-3.195.41-4.801.607a2.657 2.657 0 0 1-1.346-.743c-.156-.38-.071-.695.255-.947 1.464-.208 2.93-.409 4.395-.602.433-.089.859-.188 1.276-.298a103.558 103.558 0 0 0-3.783-5.144c-.509-.75-.316-1.2.58-1.352.373-.031.71.066 1.01.29 1.317 1.86 2.641 3.71 3.974 5.552a212.906 212.906 0 0 1 3.357-5.471c.362-.587.654-1.21.876-1.865.162-.127.33-.234.503-.32Z"
                  clipRule="evenodd"
                  opacity=".953"
                />
              </svg>
              <span className="text-keystatic-gray-dark">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
