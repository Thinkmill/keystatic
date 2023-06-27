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
      <main className="max-w-7xl mx-auto w-full px-6 pt-10 lg:pt-16 pb-16 flex flex-1">
        <div className="mx-auto w-full sm:max-w-xl flex flex-col gap-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
