import Link from 'next/link';

export function CloudBanner() {
  return (
    <Link
      href="https://keystatic.cloud"
      className="group relative my-6 block bg-sand-11 md:my-12"
    >
      <div className="absolute inset-0 bg-pattern-texture opacity-50 transition duration-150 group-hover:opacity-90" />
      <span className="relative mx-auto block max-w-5xl px-6 py-6 md:py-10">
        <span className="flex items-center justify-center gap-4 text-pretty text-center text-base text-white">
          <span>
            Simplify GitHub authentication, optimise images and more with{' '}
            <span className="underline">Keystatic Cloud</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="hidden size-6 shrink-0 transition group-hover:translate-x-1 lg:block"
            aria-hidden="true"
            aria-label="Learn more about Keystatic Cloud"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
}
