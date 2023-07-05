import Footer from '../../../components/footer';

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
        url: 'https://keystatic.io/images/keystatic-docs/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Keystatic cover image',
        type: 'image/jpeg',
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
      <main
        className="mx-auto w-full sm:max-w-xl flex flex-col flex-1 gap-4 px-6 pt-10 lg:pt-16 pb-16 outline-0"
        tabIndex={-1}
        aria-labelledby="heading-1-overview"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
