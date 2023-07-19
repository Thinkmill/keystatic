import { NextRootProvider, nextRootScript } from '@keystar/ui/next';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Layout } from '../components/layout';
import { getNavigation } from '../utils/packages';
import { basePageTitle } from './utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: basePageTitle,
  icons: [
    { type: 'image/svg+xml', url: '/favicon.svg' },
    { type: 'image/png', url: '/favicon.png' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextRootProvider fontClassName={inter.variable} locale="en-US">
      <head>{nextRootScript}</head>
      <body>
        <Layout navigation={await getNavigation()}>{children}</Layout>
      </body>
    </NextRootProvider>
  );
}
