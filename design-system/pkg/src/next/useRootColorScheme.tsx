'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ColorScheme } from '@keystar/ui/types';

type ColorSchemeContextType = ReturnType<typeof useColorSchemeState>;

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'light',
  setColorScheme: () => {
    throw new Error('ColorSchemeContext was not initialized.');
  },
});
export const ColorSchemeProvider = ({ children }: PropsWithChildren) => {
  const value = useColorSchemeState();
  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export function useRootColorScheme() {
  return useContext(ColorSchemeContext);
}

const STORAGE_KEY = 'keystatic-root-color-scheme';

/** @private only for initializing the provider */
function useColorSchemeState() {
  let storedPreference = useStoredColorScheme();
  let [colorScheme, setStoredValue] = useState<ColorScheme>(storedPreference);

  let setColorScheme = (colorScheme: ColorScheme) => {
    localStorage.setItem(STORAGE_KEY, colorScheme);
    setStoredValue(colorScheme);
  };

  // fix for renamed value: "system" --> "auto"
  // remove after a month or so: ~2023-10-01
  useEffect(() => {
    // @ts-expect-error
    if (colorScheme === 'system') {
      setColorScheme('auto');
    }
  }, [colorScheme]);

  return { colorScheme, setColorScheme };
}

const useStoredColorScheme =
  typeof window === 'undefined'
    ? function useStoredColorScheme() {
        return 'auto';
      }
    : function useStoredColorScheme() {
        return useLocalStorageValue(STORAGE_KEY);
      };

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
