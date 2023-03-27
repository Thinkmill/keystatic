'use client';
import { injectVoussoirStyles } from '@voussoir/core';
import { SSRProvider } from '@voussoir/ssr';
import { Toaster } from '@voussoir/toast';
import { ReactNode } from 'react';
import { Layout } from '../components/layout';
import { SidebarItem } from '../components/sidebar';
import { ThemeProvider } from '../components/theme-switcher';
import { UniversalNextLink } from '../components/UniversalNextLink';

injectVoussoirStyles();

export function Provider(props: {
  navigation: SidebarItem[];
  children: ReactNode;
}) {
  return (
    <SSRProvider>
      <ThemeProvider linkComponent={UniversalNextLink}>
        <Layout navigation={props.navigation}>{props.children}</Layout>
        <Toaster />
      </ThemeProvider>
    </SSRProvider>
  );
}
