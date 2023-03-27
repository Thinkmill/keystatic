import { Metadata } from 'next';
import { getNavigation } from '../utils/packages';
import { basePageTitle } from './utils';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/theme-switcher';
import { Layout } from '../components/layout';

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
    <ThemeProvider fontClassName={inter.variable} locale="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              let classList = document.documentElement.classList;
              let style = document.documentElement.style;
              let dark = window.matchMedia('(prefers-color-scheme: dark)');
              if (localStorage.theme === 'dark' || (!localStorage.theme && dark.matches)) {
                classList.remove('ksv-theme--light');
                classList.add('ksv-theme--dark');
                style.colorScheme = 'dark';
              }

              let fine = window.matchMedia('(any-pointer: fine)');
              if (fine.matches) {
                classList.add('ksv-theme--medium');
                classList.remove('ksv-theme--large');
              }
            })();
      `.replace(/\n|\s{2,}/g, ''),
          }}
        />
      </head>
      <body>
        <Layout navigation={await getNavigation()}>{children}</Layout>
      </body>
    </ThemeProvider>
  );
}
