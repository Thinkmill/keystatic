import { createContext, useContext, useEffect, useState } from 'react';
import { ColorScheme } from '@keystar/ui/types';

type ThemeContextType = ReturnType<typeof useTheme>;

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  setTheme: () => {
    throw new Error('ThemeContext was not initialized.');
  },
});
export const ThemeProvider = ThemeContext.Provider;
const STORAGE_KEY = 'keystatic-color-scheme';

// only for initializing the provider, for consumption use `useThemeContext()`
export function useTheme() {
  let initialValue = (localStorage.getItem(STORAGE_KEY) ||
    'auto') as ColorScheme;

  let [theme, setThemeValue] = useState<ColorScheme>(initialValue);
  let setTheme = (theme: ColorScheme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    setThemeValue(theme);
  };

  // fix for renamed value: "system" --> "auto"
  // remove after a month or so: ~2023-10-01
  useEffect(() => {
    // @ts-expect-error
    if (theme === 'system') {
      setTheme('auto');
    }
  }, [theme]);

  return { theme, setTheme };
}
export function useThemeContext() {
  return useContext(ThemeContext);
}
