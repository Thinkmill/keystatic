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
              <div className="py-10 pl-12 ">
                {/** INNER CONTENT (markdoc goes here) */}
                <div className="grid gap-6 grid-cols-[auto,12rem]">
                  <div>{children}</div>

                  <div className="sticky top-28 self-start">
                    <h5 className="text-xs uppercase text-stone-600">
                      On this page
                    </h5>
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
