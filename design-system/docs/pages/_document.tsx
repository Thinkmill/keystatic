import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';
import { renderStatic } from '@voussoir/ssr/renderStatic';

export default class Document extends NextDocument {
  static async getInitialProps(
    context: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(context);
    return propsWithCssText(initialProps);
  }

  render(): JSX.Element {
    return (
      <Html
        lang="en-US"
        className="ksv-theme ksv-theme--light ksv-theme--medium"
      >
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* Server rendering means we cannot use a real <Provider> component to do this.
          Instead, we apply the default theme classes to the html element. In order to
          prevent a flash between themes when loading the page, an inline script is put
          as close to the top of the page as possible to switch the theme as soon as
          possible during loading. It also handles when the media queries update, or
          local storage is updated. */}
          <Script
            id="theme-stuff"
            strategy="beforeInteractive"
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
        </body>
      </Html>
    );
  }
}

async function propsWithCssText(
  initialProps: DocumentInitialProps
): Promise<DocumentInitialProps> {
  const { css, ids } = await renderStatic(initialProps.html);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style
          data-emotion={`css ${ids.join(' ')}`}
          dangerouslySetInnerHTML={{ __html: css }}
        />
      </>
    ),
  };
}
