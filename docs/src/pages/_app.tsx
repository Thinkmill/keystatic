import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { DefaultSeo } from 'next-seo';
import { Analytics } from '@vercel/analytics/react';

import '../styles/global.css';

const meta = {
  title: 'Meet Keystatic',
  description:
    "Keystatic is a new tool from Thinkmill Labs that opens up your code-based content (written in Markdown, JSON or YAML) to contributors who aren't technical.",
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [rootUrl, setRootUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  // Construct the URLs for meta tags
  useEffect(() => {
    const root = window.location.origin;
    const current = root + window.location.pathname;
    setRootUrl(root);
    setCurrentUrl(current);
  }, [router.pathname]);
  return (
    <>
      <DefaultSeo
        title={meta.title}
        description={meta.description}
        openGraph={{
          url: currentUrl,
          title: meta.title,
          description: meta.description,
          images: [
            {
              url: `${rootUrl}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'Keystatic cover image',
              type: 'image/jpeg',
            },
          ],
          siteName: 'Keystatic',
        }}
        twitter={{
          handle: '@thekeystatic',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
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
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
