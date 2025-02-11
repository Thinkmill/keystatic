import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import { NavigationEvents } from '../components/navigation-events';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    template: '%s | Keystatic',
    default: 'Keystatic',
  },
  description:
    "Keystatic is a new tool from Thinkmill Labs that opens up your code-based content (written in Markdown, JSON or YAML) to contributors who aren't technical.",
  openGraph: {
    title: 'Keystatic',
    description: 'Content management for your codebase.',
    images: [
      {
        url: 'https://thinkmill-labs.keystatic.net/keystatic-site/images/hlworopofi3z/og-image',
        width: 1200,
        height: 630,
        alt: 'Keystatic cover image',
        type: 'image/png',
      },
    ],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystatic',
    description: 'Content management for your codebase.',
    site: '@thekeystatic',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {children}
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "da2712daef38442fb8d02fb6be8f0ab2"}'
        />
      </body>
    </html>
  );
}
