import { Metadata } from 'next';
import { getNavigation } from '../utils/packages';
import { Provider } from './provider';
import { basePageTitle } from './utils';

export const metadata: Metadata = {
  title: basePageTitle,
  icons: [
    { type: 'image/svg+xml', url: '/favicon.svg' },
    { type: 'image/png', url: '/favicon.png' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className="ksv-theme ksv-theme--light ksv-theme--medium">
      <head>
        <script
          id="theme-stuff"
          dangerouslySetInnerHTML={{
            __html: `(() => {
              let classList = document.documentElement.classList;
              let style = document.documentElement.style;
              let dark = window.matchMedia('(prefers-color-scheme: dark)');
              let fine = window.matchMedia('(any-pointer: fine)');

              let update = () => {
                if (localStorage.theme === "dark" || (!localStorage.theme && dark.matches)) {
                  classList.remove("ksv-theme--light");
                  classList.add("ksv-theme--dark");
                  style.colorScheme = 'dark';
                } else {
                  classList.add("ksv-theme--light");
                  classList.remove("ksv-theme--dark");
                  style.colorScheme = 'light';
                }

                if (!fine.matches) {
                  classList.remove("ksv-theme--medium");
                  classList.add("ksv-theme--large");
                } else {
                  classList.add("ksv-theme--medium");
                  classList.remove("ksv-theme--large");
                }
              };

              update();
              dark.addListener(() => {
                delete localStorage.theme;
                update();
              });
              fine.addListener(update);
              window.addEventListener('storage', update);
            })();
      `.replace(/\n|\s{2,}/g, ''),
          }}
        />
      </head>
      <body>
        <Provider navigation={await getNavigation()}>{children}</Provider>
      </body>
    </html>
  );
}
