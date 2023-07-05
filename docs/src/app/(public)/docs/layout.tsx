import { SideNav } from '../../../components/navigation/side-nav';
import { NavGroup } from '../../../components/navigation/nav-group';
import { NavItem } from '../../../components/navigation/nav-item';
import { DocsFooter } from '../../../components/footer';
import { getNavigationMap } from '../../../utils/reader';

export const metadata = {
  title: 'Keystatic - Docs',
  description: 'Documentation for Keystatic.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationMap = await getNavigationMap();

  return (
    <div className="max-w-7xl min-h-screen mx-auto w-full">
      <SideNav>
        {navigationMap?.map(({ groupName, items }) => (
          <NavGroup key={groupName} title={groupName}>
            {items.map(({ label, href, title, comingSoon }) => (
              <NavItem
                key={href}
                label={label}
                href={href}
                title={title}
                level="sub"
                comingSoon={comingSoon}
              />
            ))}
          </NavGroup>
        ))}
      </SideNav>

      {/** CONTENT */}
      <div className="px-6 flex-1 lg:pl-60 lg:pt-24">
        <div className="py-10 lg:pl-12">
          <main
            className="flex gap-8 outline-0"
            tabIndex={-1}
            aria-labelledby="heading-1-overview"
          >
            {/** INNER CONTENT */}
            <div className="flex-1">{children}</div>
          </main>

          <DocsFooter />
        </div>
      </div>
    </div>
  );
}
