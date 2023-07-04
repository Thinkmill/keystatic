import { createContext, useContext, useState } from 'react';

export type ColorScheme = 'light' | 'dark' | 'system';
type ThemeContextType = ReturnType<typeof useTheme>;

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {
    throw new Error('ThemeContext was not initialized.');
  },
});
export const ThemeProvider = ThemeContext.Provider;
const STORAGE_KEY = 'keystatic-color-scheme';

// only for initializing the provider, for consumption use `useThemeContext()`
export function useTheme() {
  let initialValue = (localStorage.getItem(STORAGE_KEY) ||
    'system') as ColorScheme;
  let [theme, setThemeValue] = useState<ColorScheme>(initialValue);
  let setTheme = (theme: ColorScheme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    setThemeValue(theme);
  };

  return { theme, setTheme };
}
export function useThemeContext() {
  return useContext(ThemeContext);
}
