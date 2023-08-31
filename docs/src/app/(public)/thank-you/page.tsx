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
        url: '/og?title=Privacy+policy',
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
      <Main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-12 pt-6">
        <div className="max-w-xl">
          <h1
            className="text-3xl font-extrabold sm:text-4xl md:text-5xl"
            id={H1_ID}
          >
            Thank you for being{' '}
            <span className="relative inline-block">
              <svg
                className="absolute -right-1 bottom-0 w-full"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 410 101"
                aria-hidden="true"
              >
                <path
                  fill="#F7DE5B"
                  d="m5.158.403 96.893 5.068 105.224 9.473 103.466 9.547 98.65 4.995-22.978 8.574 14.51 10.25 2.849 8.767-15.582 5.694 8.105 5.662 8.106 5.661-15.474 5.69 11.444 9.797 3.915 10.861-97.861-3.907-104.581-8.007-122.06-5.809-79.73-11.36L13.65 63.35 1.33 53.62l5.972-10.128-4.696-7.611 17.604-.658L7.903 20.749l5.786-11.577-8.53-8.77Z"
                />
              </svg>
              <span className="relative">curious!</span>
            </span>
          </h1>
          <p className="mt-8 text-lg text-keystatic-gray-dark">
            We're looking forward to sharing updates with you in the coming
            weeks and months.
          </p>
        </div>
      </Main>
      <Footer />
    </>
  );
}
