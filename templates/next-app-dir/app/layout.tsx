export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
          html {
              max-width: 70ch;
              padding: 3rem 1rem;
              margin: auto;
              line-height: 1.75;
              font-size: 1.25rem;
              font-family: sans-serif;
          }
          
          h1,h2,h3,h4,h5,h6 {
            margin: 1rem 0 1rem;
          }
          
          p,ul,ol {
            margin-bottom: 2rem;
            color: #1d1d1d;
          }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
