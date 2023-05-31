import Footer from '../../components/footer';
import { PageNotFound } from '../../components/page-not-found';

export default function NotFound() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-6 pt-6 pb-12 flex flex-1 items-center w-full">
        <PageNotFound />
      </main>

      <Footer />
    </>
  );
}
