import { Main } from '../../../components/main';
import Footer from '../../../components/footer';

export const metadata = {
  title: {
    template: '%s - Showcase | Keystatic',
    default: 'Showcase',
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
