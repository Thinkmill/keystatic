import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { I18nConfig } from '../../config';
import { useConfig } from './context';

const STORAGE_KEY = 'keystatic-content-locale';

export type ContentLocale = { code: string; label: string };

type ContentLocaleContextType = {
  locale: string | undefined;
  locales: ContentLocale[];
  setLocale: (code: string) => void;
};

const ContentLocaleContext = createContext<ContentLocaleContextType>({
  locale: undefined,
  locales: [],
  setLocale: () => {},
});

export function resolveInitialLocale(
  stored: string | null | undefined,
  i18n: I18nConfig | undefined
): string | undefined {
  if (!i18n) {
    return undefined;
  }
  if (stored != null && Object.keys(i18n.locales).includes(stored)) {
    return stored;
  }
  return i18n.defaultLocale;
}

// only for initializing the provider, for consumption use `useContentLocale()`
export function ContentLocaleProvider(props: { children: ReactNode }) {
  const config = useConfig();
  const i18n = config.i18n;

  const [locale, setLocaleValue] = useState<string | undefined>(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    return resolveInitialLocale(stored, i18n);
  });

  const value = useMemo<ContentLocaleContextType>(() => {
    if (!i18n) {
      return { locale: undefined, locales: [], setLocale: () => {} };
    }
    const locales: ContentLocale[] = Object.entries(i18n.locales).map(
      ([code, label]) => ({ code, label })
    );
    return {
      locale,
      locales,
      setLocale: (code: string) => {
        if (!Object.keys(i18n.locales).includes(code)) {
          return;
        }
        try {
          localStorage.setItem(STORAGE_KEY, code);
        } catch {}
        setLocaleValue(code);
      },
    };
  }, [i18n, locale]);

  return (
    <ContentLocaleContext.Provider value={value}>
      {props.children}
    </ContentLocaleContext.Provider>
  );
}

export function useContentLocale() {
  return useContext(ContentLocaleContext);
}

export function useActiveLocale(): string | undefined {
  return useContext(ContentLocaleContext).locale;
}
