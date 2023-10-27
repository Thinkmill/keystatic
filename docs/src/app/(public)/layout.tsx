import '../../styles/global.css';
import { HeaderNav } from '../../components/navigation/header-nav';
import { getNavigationMap } from '../../utils/reader';
import { cookies, draftMode } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationMap = await getNavigationMap();
  const { isEnabled } = draftMode();

  return (
    <div className="flex min-h-screen flex-col text-sand-12">
      <HeaderNav navigationMap={navigationMap} />
      {children}
      {isEnabled && (
        <div className="fixed bottom-0 right-0 border-2">
          Draft mode ({cookies().get('ks-branch')?.value}){' '}
          <form method="POST" action="/preview/end">
            <button>End preview</button>
          </form>
        </div>
      )}
    </div>
  );
}
