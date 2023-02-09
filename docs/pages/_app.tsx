import { AppProps } from 'next/app';
import NextHead from 'next/head';
import { DefaultSeo } from 'next-seo';
import { Fragment } from 'react';

import { injectVoussoirStyles } from '@voussoir/core';
import { SSRProvider } from '@voussoir/ssr';

import navigation from '../generated/navigation.json';
import { Layout } from '../components/layout';
import { SidebarItem } from '../components/sidebar';
import { ThemeProvider } from '../components/theme-switcher';
import { UniversalNextLink } from '../components/UniversalNextLink';

// TODO: replace with SSR friendly variant, and move to _document.tsx
injectVoussoirStyles();
function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Fragment>
      <NextHead>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </NextHead>
      <DefaultSeo
        titleTemplate="%s | Voussoir Design System"
        defaultTitle="Voussoir Design System"
      />

      <SSRProvider>
        <ThemeProvider linkComponent={UniversalNextLink}>
          <Layout navigation={navigation as SidebarItem[]}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SSRProvider>
    </Fragment>
  );
}

export default App;
