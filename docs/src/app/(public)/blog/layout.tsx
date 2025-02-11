import { ReactNode } from 'react';
import Footer from '../../../components/footer';
import { Main } from '../../../components/main';

export const metadata = {
  title: {
    template: '%s - Blog | Keystatic',
    default: 'Blog',
  },
  description: 'Latest news and updates from the Keystatic team.',
  openGraph: {
    title: 'Blog',
    description: 'Latest news and updates from the Keystatic team.',
    images: [{ url: '/og/other/blog' }],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'Latest news and updates from the Keystatic team.',
    site: '@thekeystatic',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Main className="mx-auto flex w-full flex-1 flex-col gap-4 px-6 pb-16 pt-10 sm:max-w-xl lg:pt-16">
        {children}
      </Main>
      <Footer />
    </>
  );
}
