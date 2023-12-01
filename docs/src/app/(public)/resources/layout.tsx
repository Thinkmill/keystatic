import { Main } from '../../../components/main';
import Footer from '../../../components/footer';

export const metadata = {
  title: {
    template: '%s - Resources | Keystatic',
    default: 'Resources',
  },
  description:
    'A collection of videos, talks, articles and other resources to help you learn Keystatic and dig deeper.',
  openGraph: {
    title: 'Resources',
    description:
      'A collection of videos, talks, articles and other resources to help you learn Keystatic and dig deeper.',
    images: [
      {
        url: '/og?title=Resources',
      },
    ],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com/resources',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources',
    description:
      'A collection of videos, talks, articles and other resources to help you learn Keystatic and dig deeper.',
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
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6">
        <Main className="flex gap-8">
          <div className="flex-1">{children}</div>
        </Main>
      </div>
      <Footer />
    </>
  );
}
