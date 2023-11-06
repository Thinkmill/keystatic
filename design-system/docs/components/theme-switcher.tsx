'use client';

import { ActionButton } from '@keystar/ui/button';
import { monitorIcon } from '@keystar/ui/icon/icons/monitorIcon';
import { moonIcon } from '@keystar/ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar/ui/icon/icons/sunIcon';
import { Icon } from '@keystar/ui/icon';
import { MenuTrigger, Menu, Item } from '@keystar/ui/menu';
import { useRootColorScheme } from '@keystar/ui/next';

import { SCHEME_AUTO, SCHEME_DARK, SCHEME_LIGHT } from '@keystar/ui/primitives';
import { css } from '@keystar/ui/style';
import { ColorScheme } from '@keystar/ui/types';
import { Text } from '@keystar/ui/typography';

const items = [
  { icon: sunIcon, label: 'Light', key: 'light' },
  { icon: moonIcon, label: 'Dark', key: 'dark' },
  { icon: monitorIcon, label: 'System', key: 'auto' },
] as const;

export function ColorSchemeMenu() {
  let { colorScheme, setColorScheme } = useRootColorScheme();
  let hideWhenLight = css({
    [`.${SCHEME_LIGHT} &`]: { display: 'none' },
    [`.${SCHEME_AUTO} &`]: {
      '@media (prefers-color-scheme: light)': { display: 'none' },
    },
  });
  let hideWhenDark = css({
    [`.${SCHEME_DARK} &`]: { display: 'none' },
    [`.${SCHEME_AUTO} &`]: {
      '@media (prefers-color-scheme: dark)': { display: 'none' },
    },
  });

  return (
    <MenuTrigger>
      <ActionButton aria-label="Theme" prominence="low">
        <Icon src={moonIcon} UNSAFE_className={hideWhenLight} />
        <Icon src={sunIcon} UNSAFE_className={hideWhenDark} />
      </ActionButton>
      <Menu
        items={items}
        onSelectionChange={([key]) => setColorScheme(key as ColorScheme)}
        disallowEmptySelection
        selectedKeys={[colorScheme]}
        selectionMode="single"
      >
        {item => (
          <Item key={item.key} textValue={item.label}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}
