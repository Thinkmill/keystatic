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
    items: items.map(({ label, page: slug, href }) => {
      const page = slug ? pagesBySlug[slug] : null;
      return {
        label: label || page?.entry.title || '',
        slug: slug || href,
        title: page?.entry.title,
      };
    }),
  }));

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
              {navigationMap?.map(({ groupName, items }) => (
                <NavList title={groupName}>
                  {items.map(({ label, slug, title }) => (
                    <NavItem
                      label={label}
                      href={`/docs/${slug}`}
                      title={title}
                    />
                  ))}
                </NavList>
              ))}

              {/* <NavList title="Getting started">
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
              </NavList> */}
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
