import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

import '../styles/global.css';

export const metadata = {
  title: 'Meet Keystatic',
  description:
    "Keystatic is a new tool from Thinkmill Labs that opens up your code-based content (written in Markdown, JSON or YAML) to contributors who aren't technical.",
  openGraph: {
    images: [
      {
        url: `/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Keystatic cover image',
        type: 'image/jpeg',
      },
    ],
    siteName: 'Keystatic',
  },
  twitter: {
    handle: '@thekeystatic',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
