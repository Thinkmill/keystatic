import '../styles/global.css';

import Footer from '../components/footer';
import { PageNotFound } from '../components/page-not-found';

import { HeaderNav } from '../components/navigation/header-nav';
import { getNavigationMap } from '../utils/reader';
import { Main } from '../components/main';

export default async function NotFound() {
  const navigationMap = await getNavigationMap();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav navigationMap={navigationMap} ignoreDocNavStyles />

      <Main
        className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-12 pt-6"
        data-pagefind-ignore
      >
        <PageNotFound />
      </Main>

      <Footer />
    </div>
  );
}
