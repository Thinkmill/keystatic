import { Styles } from '../styles';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Styles />
    </>
  );
}
