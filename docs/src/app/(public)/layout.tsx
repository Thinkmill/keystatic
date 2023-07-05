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
    <div className="min-h-screen flex flex-col">
      <HeaderNav navigationMap={navigationMap} />
      {children}
    </div>
  );
}
