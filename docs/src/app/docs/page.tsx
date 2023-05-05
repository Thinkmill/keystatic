import Link from 'next/link';
import Navigation from '../../components/navigation';
import { NavContainer, NavItem, NavList } from '../../components/sidenav';
import Button from '../../components/button';
// import Divider from '../../components/divider';

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
        <NavContainer>
          <NavList title="Getting started">
            <NavItem label="Introduction" href="/" current />
            <NavItem label="Automated setup" href="/" />
            <NavItem label="Manual installation" href="/" />
          </NavList>
        </NavContainer>

        {/** CONTENT */}
        <div className="lg:pl-60 pt-24 flex-1">
          <div className="pt-10 pl-12">
            {/** INNER CONTENT (markdoc goes here) */}
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

            {/* <Divider className="mx-auto mt-5 lg:mx-0" /> */}

            <p className="mt-6 text-lg text-stone-600">
              Keystatic is a new project from
              [Thinkmill](https://www.thinkmill.com.au) which opens up your
              code-based content (written in Markdown, JSON or YAML) to
              contributors who would prefer to write and manage content and data
              in a UI that looks more like a CMS than VS Code.
            </p>

            {/** WIP notice? */}
            <div className="relative rounded-lg p-5 bg-keystatic-gray w-full mt-6">
              <blockquote className="text-stone-600">
                <p className="flex gap-5">
                  <span>
                    We've been working on Keystatic for a while, but we're at
                    the very early stages of releasing Keystatic publicly. Much
                    more to come…
                  </span>
                </p>
              </blockquote>
            </div>

            {/* <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pb-32"> */}
            <ul className="mt-8 grid items-stretch gap-8 grid-cols-1 md:grid-cols-3">
              <li>
                <div className="grid h-full grid-rows-[auto,1fr] overflow-hidden rounded-xl border border-black">
                  {/* <Image
                  alt={`${template.label} template screenshot`}
                  src={template?.image ?? '/images/product-screen.png'}
                  width={800}
                  height={540}
                  className="border-b border-black object-cover"
                ></Image> */}

                  <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
                    <h2 className="text-xl font-semibold leading-tight">
                      New Features & Updates
                    </h2>
                    <p className="mt-4 text-stone-700">
                      Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
                      ipsum lorem ipsum lorem ipsum lorem ipsum.
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
                  {/* <Image
                  alt={`${template.label} template screenshot`}
                  src={template?.image ?? '/images/product-screen.png'}
                  width={800}
                  height={540}
                  className="border-b border-black object-cover"
                ></Image> */}

                  <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
                    <h2 className="text-xl font-semibold leading-tight">
                      New Features & Updates
                    </h2>
                    <p className="mt-4 text-stone-700">
                      Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
                      ipsum lorem ipsum lorem ipsum lorem ipsum.
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
          </div>

          {/** FOOTER */}
          <footer className="pb-10 pl-12">
            <hr className="h-px my-8 border-stone-400/20 mb-8" />

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
