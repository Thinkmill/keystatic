import { bookIcon } from '@voussoir/icon/icons/bookIcon';
import { githubIcon } from '@voussoir/icon/icons/githubIcon';
import { Icon } from '@voussoir/icon';
import { Divider } from '@voussoir/layout';
import { NavGroup, NavItem, NavList } from '@voussoir/nav-list';
import { Text } from '@voussoir/typography';

import { SidebarItem } from './types';
import { usePathname } from 'next/navigation';

/** Render nav items and groups of nav items. */
export const NavItems = ({ items }: { items: SidebarItem[] }) => {
  const pathname = usePathname();
  if (!pathname) {
    throw new Error('Missing pathname');
  }
  return (
    <NavList>
      {recursiveItems(items, pathname)}

      <Divider />
      <NavGroup title="Resources">
        <NavItem href="https://keystonejs.com/">
          <Icon src={bookIcon} />
          <Text>KeystoneJS Docs</Text>
        </NavItem>
        <NavItem href="https://github.com/keystonejs/voussoir">
          <Icon src={githubIcon} />
          <Text>Voussoir on GitHub</Text>
        </NavItem>
      </NavGroup>
    </NavList>
  );
};

export const recursiveItems = (items: SidebarItem[], currentPath: string) => {
  return items.map(linkOrGroup => {
    let key = '';
    if ('children' in linkOrGroup) {
      key += linkOrGroup.name;
      return (
        <NavGroup key={key} title={linkOrGroup.name}>
          {recursiveItems(linkOrGroup.children, currentPath)}
        </NavGroup>
      );
    }

    const current = linkOrGroup.href === currentPath ? 'page' : undefined;
    return (
      <NavItem
        key={key + linkOrGroup.name}
        href={linkOrGroup.href}
        aria-current={current}
      >
        {linkOrGroup.name}
      </NavItem>
    );
  });
};
