import Link from 'next/link';
import Navigation from '../../components/navigation';
import Divider from '../../components/divider';

export default function Docs() {
  return (
    <div>
      {/** TOP NAV */}
      <div className="border-b border-stone-400/20 flex items-center w-full fixed z-20">
        <Navigation />
      </div>

      {/** MAIN */}
      <main className="max-w-7xl min-h-screen mx-auto px-6">
        {/** SIDE NAV */}
        <div className="hidden lg:block fixed w-64 h-screen pt-24">
          <nav className="h-full py-8 overflow-y-scroll scrollbar border-r border-stone-400/20">
            Side nav
            <ul>
              <li>- Getting started</li>
              <li>- Something else</li>
            </ul>
          </nav>
        </div>

        {/** CONTENT */}
        <div className="lg:pl-64 pt-24 flex-1">
          <div className={`p-8`}>
            {/** INNER CONTENT (markdoc goes here) */}
            <h2 className="text-2xl font-bold sm:text-3xl">Keystatic Docs</h2>
            <Divider className="mx-auto mt-4 lg:mx-0" />

            <p className="mt-4 text-stone-700">
              Keystatic is a new project from
              [Thinkmill](https://www.thinkmill.com.au) which opens up your
              code-based content (written in Markdown, JSON or YAML) to
              contributors who would prefer to write and manage content and data
              in a UI that looks more like a CMS than VS Code.
            </p>

            <p className="mt-4 text-stone-700">
              We've been working on Keystatic for a while, but we're at the very
              early stages of releasing Keystatic publicly. Much more to come…
            </p>
          </div>

          {/** FOOTER */}
          <footer className="p-8">
            <p className="leading-none text-keystatic-gray-dark text-sm">
              &copy; {new Date().getFullYear()} Thinkmill. All rights reserved.{' '}
              <Link
                href="/privacy-policy"
                className="underline hover:text-black"
              >
                Privacy policy
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
