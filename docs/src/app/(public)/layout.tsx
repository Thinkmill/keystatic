import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import '../../styles/global.css';
import { HeaderNav } from '../../components/navigation/header-nav';
import { getNavigationMap } from '../../utils/reader';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Keystatic',
  description:
    "Keystatic is a new tool from Thinkmill Labs that opens up your code-based content (written in Markdown, JSON or YAML) to contributors who aren't technical.",
  openGraph: {
    images: [
      {
        url: 'https://keystatic.io/images/keystatic-docs/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Keystatic cover image',
        type: 'image/jpeg',
      },
    ],
    siteName: 'Keystatic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystatic',
    description: 'Content management for your codebase.',
    site: '@thekeystatic',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationMap = await getNavigationMap();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <HeaderNav navigationMap={navigationMap} />
          {children}
        </div>
      </body>
      <Analytics />
    </html>
  );
}
