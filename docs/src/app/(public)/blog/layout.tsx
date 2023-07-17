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
    images: [
      {
        url: '/og?title=Blog',
      },
    ],
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
  children: React.ReactNode;
}) {
  return (
    <>
      <Main className="mx-auto w-full sm:max-w-xl flex flex-col flex-1 gap-4 px-6 pt-10 lg:pt-16 pb-16">
        {children}
      </Main>
      <Footer />
    </>
  );
}
