const script = `let classList = document.documentElement.classList;
let style = document.documentElement.style;
let dark = window.matchMedia('(prefers-color-scheme: dark)');
if (dark.matches) {
  classList.remove('ksv-theme--light');
  classList.add('ksv-theme--dark');
  style.colorScheme = 'dark';
} else {
  classList.add('ksv-theme--light');
  classList.remove('ksv-theme--dark');
  style.colorScheme = 'light';
}
let fine = window.matchMedia('(any-pointer: fine)');
if (!fine.matches) {
  classList.remove('ksv-theme--medium');
  classList.add('ksv-theme--large');
} else {
  classList.add('ksv-theme--medium');
  classList.remove('ksv-theme--large');
}`.replace(/\n|\s{2,}/g, '');

export const mediaQueryOnlyColorSchemeScaleScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
