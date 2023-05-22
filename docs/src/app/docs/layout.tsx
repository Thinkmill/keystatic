import Link from 'next/link';
import Navigation from '../../components/navigation';
import { NavContainer, NavList, NavItem } from '../../components/sidenav';
import '../../styles/global.css';
import keystaticConfig from '../../../keystatic.config';
import { createReader } from '@keystatic/core/reader';

const reader = createReader('', keystaticConfig);

export const metadata = {
  title: 'Keystatic - docs',
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
    <div>
      {/** TOP NAV */}
      <div className="border-b border-stone-400/20 flex items-center w-full fixed z-20">
        <Navigation />
      </div>

      {/** MAIN */}
      <main className="max-w-7xl min-h-screen mx-auto px-6">
        {/** SIDE NAV */}
        <NavContainer>
          {navigationMap?.map(({ groupName, items }) => (
            <NavList key={groupName} title={groupName}>
              {items.map(({ label, href, title }) => (
                <NavItem key={href} label={label} href={href} title={title} />
              ))}
            </NavList>
          ))}
        </NavContainer>

        {/** CONTENT */}
        <div className="lg:pl-60 pt-24 flex-1">
          <div className="py-10 pl-12 ">
            {/** INNER CONTENT (markdoc goes here) */}
            <div className="grid gap-6 grid-cols-[auto,12rem]">{children}</div>

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
  );
}
