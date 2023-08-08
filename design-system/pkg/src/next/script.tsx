const script = `
let classList = document.documentElement.classList;
let style = document.documentElement.style;

let storedPreference = localStorage.getItem('keystatic-root-color-scheme');

if (storedPreference === 'dark') {
  classList.remove('ksv-scheme--auto', 'ksv-scheme--dark', 'ksv-scheme--light');
  classList.add('ksv-scheme--dark');
  style.colorScheme = 'dark';
} else if (storedPreference === 'light') {
  classList.remove('ksv-scheme--auto', 'ksv-scheme--dark', 'ksv-scheme--light');
  classList.add('ksv-scheme--light');
  style.colorScheme = 'light';
} else {
  classList.remove('ksv-scheme--auto', 'ksv-scheme--dark', 'ksv-scheme--light');
  classList.add('ksv-scheme--auto');
}
`.replace(/\n|\s{2,}/g, '');

/** @deprecated use `nextRootScript` instead. */
export const mediaQueryOnlyColorSchemeScaleScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
export const nextRootScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
