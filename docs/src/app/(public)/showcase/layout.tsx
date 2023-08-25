import { Main } from '../../../components/main';
import { DocsFooter } from '../../../components/footer';

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
    <div className="max-w-7xl min-h-screen mx-auto w-full">
      {/** CONTENT */}

      <Main className="flex gap-8">
        {/** INNER CONTENT */}
        <div className="flex-1">{children}</div>
      </Main>

      <DocsFooter />
    </div>
  );
}
