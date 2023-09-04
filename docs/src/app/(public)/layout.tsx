import '../../styles/global.css';
import { HeaderNav } from '../../components/navigation/header-nav';
import { getNavigationMap } from '../../utils/reader';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationMap = await getNavigationMap();

  return (
    <div className="flex min-h-screen flex-col text-slate-12">
      <HeaderNav navigationMap={navigationMap} />
      {children}
    </div>
  );
}
