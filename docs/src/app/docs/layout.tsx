import '../../styles/global.css';

export const metadata = {
  title: 'Keystatic - docs',
  description: 'Documentation for Keystatic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
