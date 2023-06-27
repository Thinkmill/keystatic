import Footer from '../../../components/footer';

export const metadata = {
  title: 'Keystatic - Blog',
  description: 'Latest news and updates from the Keystatic team.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="max-w-7xl min-h-screen mx-auto w-full px-6 py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl flex flex-col gap-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
