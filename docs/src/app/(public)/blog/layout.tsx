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
      <main className="mx-auto w-full sm:max-w-xl flex flex-col flex-1 gap-4 px-6 pt-10 lg:pt-16 pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
