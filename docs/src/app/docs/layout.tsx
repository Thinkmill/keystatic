import Link from 'next/link';
import Navigation from '../../components/navigation';
import { NavContainer, NavList, NavItem } from '../../components/sidenav';
import '../../styles/global.css';

export const metadata = {
  title: 'Keystatic - docs',
  description: 'Documentation for Keystatic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>
          {/** TOP NAV */}
          <div className="border-b border-stone-400/20 flex items-center w-full lg:fixed z-20 lg:z-30">
            <Navigation />
          </div>

          {/** MAIN */}
          <main className="max-w-7xl min-h-screen mx-auto">
            {/** SIDE NAV */}
            <NavContainer>
              <NavList title="Getting started">
                <NavItem label="Automated setup" href="/" />
                <NavItem label="Manual installation" href="/" />
              </NavList>

              <NavList title="Integration guides">
                <NavItem label="Astro" href="/" />
                <NavItem label="Next.js" href="/" />
                <NavItem label="Remix" href="/" />
              </NavList>

              <NavList title="Learn Keystatic">
                <NavItem label="Collections & Singletons" href="/" />
                <NavItem label="Local vs. GitHub" href="/" />
                <NavItem label="Reader API" href="/" />
                <NavItem label="Renderer API" href="/" />
                <NavItem label="Content Organisation" href="/" />
                <NavItem label="FAQ" href="/" />
              </NavList>

              <NavList title="Fields API">
                <NavItem label="Text" href="/" />
                <NavItem label="Integer" href="/" />
                <NavItem label="URL" href="/" />
                <NavItem label="Path Reference" href="/" />
                <NavItem label="Relationship" href="/" />
                <NavItem label="Select" href="/" />
                <NavItem label="Slug" href="/" />
                <NavItem label="Multi-Select" href="/" />
                <NavItem label="Checkbox" href="/" />
                <NavItem label="Image" href="/" />
                <NavItem label="Date" href="/" />
                <NavItem label="Empty" href="/" />
                <NavItem label="Child" href="/" />
                <NavItem label="Object" href="/" />
                <NavItem label="Conditional" href="/" />
                <NavItem label="Document" href="/" />
                <NavItem label="Array" href="/" />
              </NavList>

              <NavList title="Community">
                <NavItem label="GitHub Discussions" href="/" />
                <NavItem label="Socials" href="/" />
              </NavList>
            </NavContainer>

            {/** CONTENT */}
            <div className="px-6 flex-1 lg:pl-60 lg:pt-24 ">
              <div className="py-10 lg:pl-12">
                {/** INNER CONTENT (markdoc goes here) */}
                <div className="flex gap-8">
                  <div className="flex-1">{children}</div>

                  {/** TOCs */}
                  <div className="w-[12rem] sticky top-16 lg:top-32 self-start hidden md:block lg:hidden 2lg:block">
                    <h5 className="text-xs uppercase text-black text-stone-500">
                      On this page
                    </h5>

                    <ul className="mt-2">
                      <li>
                        <a
                          className="block text-sm text-stone-700 leading-tight py-1 font-semibold hover:underline"
                          href="#"
                        >
                          Example
                        </a>
                      </li>

                      <li>
                        <a
                          className="block text-sm text-stone-500 leading-tight py-1 hover:underline"
                          href="#"
                        >
                          Example with really long label
                        </a>
                      </li>

                      <li>
                        <a
                          className="block text-xs text-stone-500 pl-2 leading-tight py-1 hover:underline"
                          href="#"
                        >
                          Example with really long label label label
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/** FOOTER */}
                <footer>
                  <hr className="h-px my-8 border-stone-400/20 mb-8" />

                  <p className="leading-none text-keystatic-gray-dark text-sm">
                    &copy; {new Date().getFullYear()} Thinkmill. All rights
                    reserved.{' '}
                    <Link
                      href="/privacy-policy"
                      className="underline hover:text-black"
                    >
                      Privacy policy
                    </Link>
                  </p>
                </footer>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
