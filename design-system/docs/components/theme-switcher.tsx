'use client';

import { ActionButton } from '@keystar/ui/button';
import { monitorIcon } from '@keystar/ui/icon/icons/monitorIcon';
import { moonIcon } from '@keystar/ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar/ui/icon/icons/sunIcon';
import { Icon } from '@keystar/ui/icon';
import { MenuTrigger, Menu, Item } from '@keystar/ui/menu';
import { useRootColorScheme } from '@keystar/ui/next';
import { css } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

const SCHEMES = {
  light: { icon: sunIcon, label: 'Light' },
  dark: { icon: moonIcon, label: 'Dark' },
  system: { icon: monitorIcon, label: 'System' },
} as const;
type ColorScheme = keyof typeof SCHEMES;
const themeItems = Object.entries(SCHEMES).map(([id, { icon, label }]) => ({
  id,
  icon,
  label,
}));

export function ColorSchemeMenu() {
  let { colorScheme, setColorScheme } = useRootColorScheme();
  let hideWhenLight = css({ '.ksv-scheme--light &': { display: 'none' } });
  let hideWhenDark = css({ '.ksv-scheme--dark &': { display: 'none' } });

  return (
    <MenuTrigger>
      <ActionButton aria-label="Theme" prominence="low">
        <Icon src={moonIcon} UNSAFE_className={hideWhenLight} />
        <Icon src={sunIcon} UNSAFE_className={hideWhenDark} />
      </ActionButton>
      <Menu
        items={themeItems}
        onSelectionChange={([key]) => setColorScheme(key as ColorScheme)}
        disallowEmptySelection
        selectedKeys={[colorScheme]}
        selectionMode="single"
      >
        {item => (
          <Item textValue={item.label}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}
