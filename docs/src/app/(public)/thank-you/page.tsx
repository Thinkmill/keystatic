import Footer from '../../../components/footer';
import { Main } from '../../../components/main';
import { H1_ID } from '../../../constants';

export const metadata = {
  title: {
    template: '%s - Thank you | Keystatic',
    default: 'Thank you',
  },
  description: 'Thank you for being curious!',
  openGraph: {
    title: 'Thank you',
    description: 'Thank you for being curious!',
    images: [
      {
        url: '/og/other/privacy-policy',
      },
    ],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com/thank-you',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thank you',
    description: 'Thank you for being curious!',
    site: '@thekeystatic',
  },
};

export default function ThankYouPage() {
  return (
    <>
      <Main
        className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-24 pt-24"
        data-pagefind-ignore
      >
        <div className="flex max-w-xl flex-col gap-6 pt-10">
          <h1 className="text-5xl font-medium" id={H1_ID}>
            Thank you for being curious!
          </h1>
          <p className="text-lg">
            We're looking forward to sharing updates with you in the coming
            weeks and months.
          </p>
        </div>
      </Main>
      <Footer />
    </>
  );
}
