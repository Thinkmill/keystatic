import { ReaderRefresh } from '@keystatic/next/reader-refresh';
import { reader } from './reader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ReaderRefresh reader={reader} />
      </body>
    </html>
  );
}
