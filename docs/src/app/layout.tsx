import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { NavigationEvents } from '../components/navigation-events';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
      <Analytics />
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </html>
  );
}
