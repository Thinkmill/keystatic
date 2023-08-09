import { createContext, useContext, useState } from 'react';
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
  let [theme, setThemeValue] = useState<ColorScheme>(() => {
    let storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue === 'light' || storedValue === 'dark') {
      return storedValue;
    }
    return 'auto';
  });
  let setTheme = (theme: ColorScheme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    setThemeValue(theme);
  };

  return { theme, setTheme };
}
export function useThemeContext() {
  return useContext(ThemeContext);
}
