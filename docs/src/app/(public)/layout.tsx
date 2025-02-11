import '../../styles/global.css';
import { HeaderNav } from '../../components/navigation/header-nav';
import { getNavigationMap } from '../../utils/reader';
import { ReactNode } from 'react';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigationMap = await getNavigationMap();
  return (
    <>
      <div className="flex min-h-screen flex-col text-sand-12">
        <HeaderNav navigationMap={navigationMap} />
        {children}
      </div>
      <div className="fixed" aria-hidden="true">
        <input type="text" className="opacity-0" />
      </div>
    </>
  );
}
