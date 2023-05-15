import Link from 'next/link';
import Navigation from '../../components/navigation';
import { NavContainer, NavList, NavItem } from '../../components/sidenav';
import '../../styles/global.css';
import keystaticConfig from '../../../keystatic.config';
import { createReader } from '@keystatic/core/reader';

const reader = createReader('', keystaticConfig);

export const metadata = {
  title: 'Keystatic - Docs',
  description: 'Documentation for Keystatic',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await reader.singletons.navigation.read();
  const pages = await reader.collections.pages.all();

  const pagesBySlug = Object.fromEntries(pages.map(page => [page.slug, page]));

  const navigationMap = navigation?.navGroups.map(({ groupName, items }) => ({
    groupName,
    items: items.map(({ label, link }) => {
      const { discriminant, value } = link;
      const page = discriminant === 'page' && value ? pagesBySlug[value] : null;
      const url = discriminant === 'url' ? value : `/docs/${page?.slug}`;

      return {
        label: label || page?.entry.title || '',
        href: url || '',
        title: page?.entry.title,
      };
    }),
  }));

  return (
    <html lang="en">
      <body>
        <div>
          {/** TOP NAV */}
          <div className="border-b border-stone-400/20 flex items-center w-full lg:fixed z-20 lg:z-30">
            <Navigation navigationMap={navigationMap} />
          </div>

          {/** MAIN */}
          <main className="max-w-7xl min-h-screen mx-auto">
            {/** SIDE NAV */}
            <NavContainer>
              {navigationMap?.map(({ groupName, items }) => (
                <NavList key={groupName} title={groupName}>
                  {items.map(({ label, href, title }) => (
                    <NavItem
                      key={href}
                      label={label}
                      href={href}
                      title={title}
                      level="sub"
                    />
                  ))}
                </NavList>
              ))}
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
