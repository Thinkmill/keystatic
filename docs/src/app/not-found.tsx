import '../styles/global.css';

import Footer from '../components/footer';
import { PageNotFound } from '../components/page-not-found';

import { HeaderNav } from '../components/navigation/header-nav';
import { getNavigationMap } from '../utils/reader';

export default async function NotFound() {
  const navigationMap = await getNavigationMap();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNav navigationMap={navigationMap} ignoreDocNavStyles />

      <main
        className="mx-auto max-w-7xl px-6 pt-6 pb-12 flex flex-1 items-center w-full outline-0"
        tabIndex={-1}
        aria-labelledby="heading-1-overview"
      >
        <PageNotFound />
      </main>

      <Footer />
    </div>
  );
}
