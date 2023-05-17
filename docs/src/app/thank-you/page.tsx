import { HeaderNav } from '../../components/navigation/header-nav';
import Footer from '../../components/footer';

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Thank you for being{' '}
              <span className="relative">
                <svg
                  className="absolute -right-1 bottom-0 w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 410 101"
                >
                  <path
                    fill="#F7DE5B"
                    d="m5.158.403 96.893 5.068 105.224 9.473 103.466 9.547 98.65 4.995-22.978 8.574 14.51 10.25 2.849 8.767-15.582 5.694 8.105 5.662 8.106 5.661-15.474 5.69 11.444 9.797 3.915 10.861-97.861-3.907-104.581-8.007-122.06-5.809-79.73-11.36L13.65 63.35 1.33 53.62l5.972-10.128-4.696-7.611 17.604-.658L7.903 20.749l5.786-11.577-8.53-8.77Z"
                  />
                </svg>
                <span className="relative">curious</span>
              </span>
              !
            </h1>
            <p className="mt-10 text-2xl text-keystatic-gray-dark">
              We’re looking forward to sharing updates with you in the coming
              weeks and months.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
