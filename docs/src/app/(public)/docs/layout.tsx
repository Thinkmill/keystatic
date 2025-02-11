import { SideNav } from '../../../components/navigation/side-nav';
import { NavGroup } from '../../../components/navigation/nav-group';
import { NavItem } from '../../../components/navigation/nav-item';
import { DocsFooter } from '../../../components/footer';
import { getNavigationMap } from '../../../utils/reader';
import { Main } from '../../../components/main';
import { ReactNode } from 'react';

export const metadata = {
  title: {
    template: '%s - Docs | Keystatic',
    default: 'Docs',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigationMap = await getNavigationMap();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl">
      <SideNav>
        {navigationMap?.map(({ groupName, items }) => (
          <NavGroup key={groupName} title={groupName}>
            {items.map(({ label, href, title, comingSoon, status }) => (
              <NavItem
                key={href}
                label={label}
                href={href}
                title={title}
                level="sub"
                comingSoon={comingSoon}
                status={status}
              />
            ))}
          </NavGroup>
        ))}
      </SideNav>

      {/** CONTENT */}
      <div className="flex-1 px-6 pt-24 lg:pl-60">
        <div className="py-10 lg:pl-12">
          <Main className="flex gap-8">
            {/** INNER CONTENT */}
            <div className="flex-1">{children}</div>
          </Main>

          <DocsFooter />
        </div>
      </div>
    </div>
  );
}
