import { Main } from '../../../components/main';
import Footer from '../../../components/footer';

export const metadata = {
  title: {
    template: '%s - Showcase | Keystatic',
    default: 'Showcase',
  },
  description:
    'A collection of projects using Keystatic to manage parts of their codebase.',
  openGraph: {
    title: 'Showcase',
    description:
      'A collection of projects using Keystatic to manage parts of their codebase.',
    images: [
      {
        url: '/og?title=Showcase',
      },
    ],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com/showcase',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showcase',
    description:
      'A collection of projects using Keystatic to manage parts of their codebase.',
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
        {/** CONTENT */}

        <Main className="flex gap-8">
          {/** INNER CONTENT */}
          <div className="flex-1">{children}</div>
        </Main>
      </div>
      <Footer />
    </>
  );
}
