'use client';
import { useEffect, useState } from 'react';

import { Button } from '@keystar-ui/button';
import { VoussoirProviderProps } from '@keystar-ui/core';
import { RootVoussoirProvider } from '@keystar-ui/next';
import { moonIcon } from '@keystar-ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar-ui/icon/icons/sunIcon';
import { Icon } from '@keystar-ui/icon';
import { css, useMediaQuery } from '@keystar-ui/style';

export function ThemeProvider({
  children,
  ...otherProps
}: Omit<VoussoirProviderProps, 'colorScheme' | 'linkComponent'> & {
  fontClassName: string;
}) {
  const colorScheme = useCurrentColorScheme();
  return (
    <RootVoussoirProvider {...otherProps} colorScheme={colorScheme}>
      {children}
    </RootVoussoirProvider>
  );
}

// Theme switcher
// ----------------------------------------------------------------------------

function InnerThemeSwitcher(props: {
  colorScheme: 'dark' | 'light';
  className: string;
}) {
  let onPress = () => {
    localStorage.theme = props.colorScheme === 'dark' ? 'light' : 'dark';
    window.dispatchEvent(new Event('storage'));
  };

  const nextScheme = props.colorScheme === 'light' ? 'dark' : 'light';
  const label = `Switch to ${nextScheme} theme`;
  const icon = props.colorScheme === 'dark' ? sunIcon : moonIcon;

  return (
    <div title={label} className={props.className} role="presentation">
      <Button aria-label={label} onPress={onPress} prominence="low">
        <Icon src={icon} />
      </Button>
    </div>
  );
}

export function ThemeSwitcher() {
  return (
    <>
      <InnerThemeSwitcher
        className={css({
          '.ksv-theme--light &': {
            display: 'none',
          },
        })}
        colorScheme="dark"
      />
      <InnerThemeSwitcher
        className={css({
          '.ksv-theme--dark &': {
            display: 'none',
          },
        })}
        colorScheme="light"
      />
    </>
  );
}

function useLocalStorageValue(key: string) {
  let [value, setValue] = useState(() => localStorage[key]);
  useEffect(() => {
    const handler = () => {
      setValue(localStorage[key]);
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [key]);
  return value;
}

export const useCurrentColorScheme =
  typeof window === 'undefined'
    ? function useCurrentColorScheme() {
        return 'light';
      }
    : function useCurrentColorScheme() {
        const autoPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
        const defaultTheme = autoPrefersDark ? 'dark' : 'light';
        const localStorageValue = useLocalStorageValue('theme');
        return localStorageValue === 'light' || localStorageValue === 'dark'
          ? localStorageValue
          : defaultTheme;
      };
