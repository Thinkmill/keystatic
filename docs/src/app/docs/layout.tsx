import '../../styles/global.css';
import { SideNav } from '../../components/navigation/side-nav';
import { NavGroup } from '../../components/navigation/nav-group';
import { NavItem } from '../../components/navigation/nav-item';
import { DocsFooter } from '../../components/footer';
import { TableOfContents } from '../../components/navigation/toc';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';

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
    <div className="max-w-7xl min-h-screen mx-auto">
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
          <main className="flex gap-8">
            {/** INNER CONTENT */}
            <div className="flex-1">{children}</div>

            {/** TOCs */}
            <TableOfContents />
          </main>

          <DocsFooter />
        </div>
      </div>
    </div>
  );
}
