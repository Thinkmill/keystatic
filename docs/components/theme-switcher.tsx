import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@voussoir/button';
import { VoussoirProvider, VoussoirProviderProps } from '@voussoir/core';
import { moonIcon } from '@voussoir/icon/icons/moonIcon';
import { sunIcon } from '@voussoir/icon/icons/sunIcon';
import { Icon } from '@voussoir/icon';
import { useIsSSR } from '@voussoir/ssr';

export function ThemeProvider({
  children,
  colorScheme: colorSchemeProp,
  ...otherProps
}: VoussoirProviderProps) {
  let colorScheme = useCurrentColorScheme();

  return (
    <VoussoirProvider
      colorScheme={colorSchemeProp || colorScheme}
      {...otherProps}
    >
      {children}
    </VoussoirProvider>
  );
}

// Theme switcher
// ----------------------------------------------------------------------------

export function ThemeSwitcher() {
  let colorScheme = useCurrentColorScheme();
  let onPress = () => {
    localStorage.theme = colorScheme === 'dark' ? 'light' : 'dark';
    window.dispatchEvent(new Event('storage'));
  };

  const nextScheme = colorScheme === 'light' ? 'dark' : 'light';
  const label = `Switch to ${nextScheme} theme`;
  const icon = colorScheme === 'dark' ? sunIcon : moonIcon;

  return (
    <div title={label} role="presentation">
      <Button aria-label={label} onPress={onPress} prominence="low">
        <Icon src={icon} />
      </Button>
    </div>
  );
}
export function ClientOnly({ children }: { children: React.ReactElement }) {
  const isSSR = useIsSSR();
  return isSSR ? null : <Fragment>{children}</Fragment>;
}

function ssrSafeHook<T>(hook: T) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  return hook;
}
export const useCurrentColorScheme = ssrSafeHook(useColorSchemeInternal);

function useColorSchemeInternal() {
  let mq = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  let getCurrentColorScheme = useCallback(
    () => localStorage.theme || (mq.matches ? 'dark' : 'light'),
    [mq]
  );
  let [colorScheme, setColorScheme] = useState(() => getCurrentColorScheme());

  useEffect(() => {
    let onChange = () => {
      setColorScheme(getCurrentColorScheme());
    };

    mq.addListener(onChange);
    window.addEventListener('storage', onChange);
    return () => {
      mq.removeListener(onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [getCurrentColorScheme, mq]);

  return colorScheme;
}
