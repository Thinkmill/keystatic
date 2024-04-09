import KeystaticApp from './keystatic';

export const metadata = {
  title: 'Keystatic',
};

export const runtime = 'edge';

export default function RootLayout() {
  return (
    <html>
      <head />
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
