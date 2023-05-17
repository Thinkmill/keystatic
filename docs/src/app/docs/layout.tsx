import { HeaderNav } from '../../components/navigation/header-nav';
import '../../styles/global.css';
import keystaticConfig from '../../../keystatic.config';
import { createReader } from '@keystatic/core/reader';
import { SideNav } from '../../components/navigation/side-nav';
import { NavGroup } from '../../components/navigation/nav-group';
import { NavItem } from '../../components/navigation/nav-item';
import { DocsFooter } from '../../components/footer';
import { TableOfContents } from '../../components/navigation/toc';

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
    <div>
      {/** TOP NAV */}
      <div className="border-b border-stone-400/20 flex items-center w-full lg:fixed z-20 lg:z-30">
        <HeaderNav navigationMap={navigationMap} />
      </div>

      {/** MAIN */}
      <main className="max-w-7xl min-h-screen mx-auto">
        <SideNav>
          {navigationMap?.map(({ groupName, items }) => (
            <NavGroup key={groupName} title={groupName}>
              {items.map(({ label, href, title }) => (
                <NavItem
                  key={href}
                  label={label}
                  href={href}
                  title={title}
                  level="sub"
                />
              ))}
            </NavGroup>
          ))}
        </SideNav>

        {/** CONTENT */}
        <div className="px-6 flex-1 lg:pl-60 lg:pt-24">
          <div className="py-10 lg:pl-12">
            <div className="flex gap-8">
              {/** INNER CONTENT */}
              <div className="flex-1">{children}</div>

              {/** TOCs */}
              <TableOfContents />
            </div>

            <DocsFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
